import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import app, { db } from "../../Config/firebase";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { ref, onValue, push, update, remove } from "firebase/database";
import { useCodeStore } from "store/CodeStore";
import { Image } from "expo-image";
import { listFiles, uploadToFirebase } from "../../Config/firebase";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

const { height, width } = Dimensions.get("screen");

const Account = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userNum = useCodeStore((state) => state.number);
  const userId = useCodeStore((state) => state.id);
  const [firstName, setFirstName] = useState("Not set yet");
  const [lastName, setLastName] = useState("Not set yet");
  const [image, setImage] = useState<null | string>(null);
  const [edit, setEdit] = useState(false);
  const [visible, setVisible] = useState(false);
  const dbLocation = `/users/${userId}`;
  const router = useRouter();

  const onSaveUser = async () => {
    update(ref(db, dbLocation), {
      firstName: firstName,
      lastName: lastName,
    }).then(() => setEdit(false));
  };

  const DeleteAccount = () => {
    remove(ref(db, dbLocation)).then(async () => {
      router.replace({
        pathname: "/onboarding",
        params: {
          sessionExpired: "false",
        },
      }),
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Account successfully deleted",
            body: "Thank you for using Zira😊",
            badge: 1,
            interruptionLevel: "active",
            priority: "high",
            color: "#FFB7CE",
          },
          trigger: { seconds: 1.5 },
        });
    });
  };

  const captureImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
      base64: true,
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const uri = result.assets[0].uri;
      const fileName = uri.split("/").pop();
      const uploadResp = await uploadToFirebase(uri, fileName, (v) =>
        console.log(v, "upload progress")
      );
      if (uploadResp !== null || undefined) {
        update(ref(db, dbLocation), {
          imageUrl: uploadResp.downloadUrl,
        });
      }
    }
  };

  useEffect(() => {
    return onValue(ref(db, dbLocation), (querySnapShot) => {
      let data = querySnapShot.val() || {};
      if (data !== null) {
        if (data.imageUrl !== null) {
          console.log(data);
          setImage(data.imageUrl);
        }
        if (data.firstname !== null && data.lastname !== null) {
          setFirstName(data.firstName);
          setLastName(data.lastName);
        }
      }
    });
  }, []);

  console.log(visible);
  return (
    <BlurView intensity={60} style={styles.blur}>
      {visible && (
        <>
          <View style={styles.content}>
            <LottieView
              autoPlay
              style={styles.lottie}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../../assets/lottie/anim4.json")}
            />
            <Text style={styles.modalTxt}>Are you sure? </Text>
            <View
              style={[styles.row, { gap: 10, justifyContent: "space-evenly" }]}
            >
              <Button
                mode="contained"
                style={{ marginTop: 30 }}
                buttonColor={Colors.red}
                textColor={Colors.white}
                onPress={() => DeleteAccount()}
              >
                Proceed
              </Button>
              <Button
                mode="contained"
                style={{ marginTop: 30 }}
                buttonColor={Colors.gray}
                textColor={Colors.white}
                onPress={() => setVisible(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </>
      )}
      <View style={styles.mainView}>
        {!edit && (
          <>
            <TouchableOpacity onPress={() => captureImg()} style={styles.btn}>
              {image == null ? (
                <Ionicons name="person" size={35} color={Colors.white} />
              ) : (
                <Image source={{ uri: image }} style={styles.img} />
              )}
            </TouchableOpacity>

            <View style={styles.row2}>
              <TouchableOpacity
                onPress={() => setEdit(true)}
                style={styles.ico}
              >
                <EvilIcons
                  name="pencil"
                  size={30}
                  color={Colors.primary2}
                  style={styles.icon2}
                  onPress={() => setEdit(true)}
                />
              </TouchableOpacity>
              <View style={[styles.editRow, { flex: 0.5, left: width * 0.2 }]}>
                <Text style={styles.name}>
                  First name: <Text style={styles.subName}>{firstName}</Text>
                </Text>

                <Text style={styles.name}>
                  Last name: <Text style={styles.subName}>{lastName}</Text>
                </Text>
              </View>
            </View>
          </>
        )}
        {edit && (
          <>
            <TouchableOpacity onPress={() => captureImg()} style={styles.btn}>
              {image == null ? (
                <Ionicons name="person" size={35} color={Colors.white} />
              ) : (
                <Image source={{ uri: image }} style={styles.img} />
              )}
            </TouchableOpacity>
            <View style={styles.editRow}>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={(text: string) => setFirstName(text)}
                  placeholder="Enter your first name"
                  cursorColor={Colors.primary2}
                  selectionColor={Colors.primary2}
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={(text: string) => setLastName(text)}
                  placeholder="Enter your last name"
                  cursorColor={Colors.primary2}
                  selectionColor={Colors.primary2}
                />
              </View>
              <View style={[styles.row, { gap: 20 }]}>
                <Button
                  mode="elevated"
                  buttonColor={Colors.primary2}
                  textColor={Colors.black}
                  onPress={() => onSaveUser()}
                >
                  Save
                </Button>
                <Button
                  mode="outlined"
                  textColor={Colors.white}
                  onPress={() => setEdit(false)}
                  style={{ borderColor: Colors.red }}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </>
        )}
      </View>
      <View
        style={[
          styles.actions,
          { bottom: edit == true ? height * 0.08 : height * 0.22 },
        ]}
      >
        <TouchableOpacity style={styles.btn2} onPress={() => setVisible(true)}>
          <Ionicons name="log-out" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Delete account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2}>
          <Ionicons name="person" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2}>
          <Ionicons name="bulb" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2}>
          <Ionicons name="megaphone" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18, flex: 1 }}>Inbox</Text>
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 10,
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>14</Text>
          </View>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

export default Account;

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    backgroundColor: Colors.darkTransparent2,
  },
  mainView: {
    flex: 1,
  },
  editRow: {
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
    top: height * 0.1,
  },
  name: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  subName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  btn: {
    borderWidth: 1,
    borderColor: Colors.white,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: height * 0.1,
    marginBottom: 30,
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  icon: {
    alignSelf: "center",
    top: height * 0.07,
    left: width * 0.15,
  },
  row: {
    flexDirection: "row",
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderBottomWidth: 1.5,
    borderColor: Colors.white,
    width: width * 0.8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: Colors.white,
  },
  icon2: {},
  ico: {
    top: height * 0.11,
    left: width * 0.22,
    alignItems: "center",
  },
  actions: {
    gap: 10,
    borderRadius: 16,
    backgroundColor: Colors.gray2,
  },
  btn2: {
    padding: 14,
    flexDirection: "row",
    gap: 20,
  },
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignSelf: "center",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    height: 200,
    width: 230,
    shadowColor: "#000",
    top: height * 0.3,
    position: "absolute",
    zIndex: 1000,
  },
  modalTxt: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  lottie: {
    width: 70,
    height: 70,
    alignSelf: "center",
  },
});
