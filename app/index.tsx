import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Asset, useAssets } from "expo-asset";
import { ResizeMode, Video } from "expo-av";
import Colors from "@/constants/Colors";
import { Link, useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import { Modal, Portal, Button, PaperProvider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

const { height, width } = Dimensions.get("screen");

const Page = () => {
  const [assets, error] = useAssets([require("../assets/video/video2.mp4")]);
  const [visible, setVisible] = useState(false);
  const { sessionExpired } = useLocalSearchParams();
  const [sessionValue, setSessionValue] = useState(sessionExpired);
  const handleVideoRef = React.useRef(null);

  if (sessionExpired == "true") schedulePushNotification();

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Session expiration!⚠️",
        body: "Your active session has expired. Please log in again. Thank you for using Zira😊",
        badge: 1,
        interruptionLevel: "active",
        priority: "high",
        color: "#FFB7CE",
      },
      trigger: { seconds: 1.5 },
    });
  }

  return (
    <View style={styles.container}>
      {Platform.OS == "android" && assets !== undefined && (
        <Video
          source={{ uri: assets[0].uri }}
          style={styles.video}
          isLooping
          isMuted
          shouldPlay
          resizeMode={ResizeMode.COVER}
        />
      )}
      {Platform.OS == "ios" && assets !== undefined && (
        <Video
          source={{ uri: assets[0].uri }}
          style={styles.video}
          isLooping
          isMuted
          shouldPlay
          resizeMode={ResizeMode.COVER}
        />
      )}

      {sessionExpired == "true" && (
        <Portal>
          <Modal
            visible={sessionValue == "true" ? true : false}
            contentContainerStyle={styles.modal}
            onDismiss={() => null}
          >
            <MaterialIcons name="error" size={40} color={Colors.red} />
            <Text style={styles.modalText}>Your session has expired</Text>
            <Button
              style={{ marginTop: 10, borderColor: Colors.white }}
              mode="outlined"
              labelStyle={{ color: Colors.white }}
              onPress={() => setSessionValue("false")}
            >
              Proceed
            </Button>
          </Modal>
        </Portal>
      )}
      <View style={styles.leadTextView}>
        <Text style={styles.leadText}>
          Ready to change how you move money? Let's Zirafy!
        </Text>
      </View>
      <View style={{ flex: 0.9 }} />
      <View style={styles.buttons}>
        <Link href="/login" asChild style={defaultStyles.pillButton}>
          <TouchableOpacity style={styles.btn2} activeOpacity={0.1}>
            <Text style={[styles.btnText1, { fontSize: 15 }]}>Login</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/signup" asChild style={defaultStyles.pillButton}>
          <TouchableOpacity style={styles.btn} activeOpacity={0.1}>
            <Text style={[styles.btnText1, { fontSize: 15 }]}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  video: {
    height: height,
    width: width,
    position: "absolute",
  },
  leadTextView: {
    padding: 20,
    marginTop: height * 0.1,
  },
  leadText: {
    fontSize: 25,
    color: Colors.white,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
  },
  btnText1: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    width: 300,
    height: 200,
    alignSelf: "center",
  },
  modalText: {
    marginVertical: 15,
    textAlign: "center",
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  btn: {
    padding: 10,
    height: 70,
    width: 120,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.green,
  },
  btn2: {
    padding: 10,
    height: 70,
    width: 120,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary2,
  },
});
