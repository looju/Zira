import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import app, { db } from "../Config/firebase";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useFirebaseLogin } from "@itzsunny/firebase-login";
import { ref, push, onValue, get } from "firebase/database";
import { Validation, numType } from "@/hooks/numbervalidation";
import * as LocalAuthentication from "expo-local-authentication";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useStore } from "zustand";
import { useCodeStore } from "store/CodeStore";

const { width, height } = Dimensions.get("screen");

const Login = () => {
  const [countryCode, setCountryCode] = useState("+234");
  const [number, setNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [authType, setAuthType] = useState<null | number>(null);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const auth = getAuth(app);
  const route = useRouter();
  const recaptchaVerifier = useRef(null);
  const attemptInvisibleVerification = false;
  const firebaseConfig: FirebaseOptions | undefined = app
    ? app.options
    : undefined;
  const { recaptcha, recaptchaBanner, sendOtp, verifyOtp } = useFirebaseLogin({
    auth: auth,
    firebaseConfig: firebaseConfig,
  });
  const addCountryCode = useCodeStore((state) => state.addCode);

  const onSignIn = async () => {
    setLoading(true);
    const fullNumber = countryCode + number;
    let foundUser;
    //search db for number then bring up faceID or touchID
    const users = (await get(ref(db, "/users"))).val();
    if (users !== null) {
      const usersArr = Object.values(users).find((value) =>
        value.number == fullNumber ? (foundUser = true) : (foundUser = false)
      );
      setLoading(false);
      console.log(usersArr);
      if (foundUser == true) {
        addCountryCode(usersArr.country);
        isBiometricSupported == true
          ? biometricAuth()
          : route.replace("/(tabs)/home");
      } else {
        setErrorMessage("This number does not exist. Try signing up!");
      }
    }
    console.log(users, "users from db");
  };

  const biometricAuth = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Zira",
      disableDeviceFallback: true,
      cancelLabel: "Cancel",
    });
    if (result.success) {
      route.replace("/(tabs)/home");
    } else {
      return;
    }
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={defaultStyles.container}>
          {recaptcha}
          <Text style={defaultStyles.header}>Welcome back!</Text>
          <Text style={defaultStyles.descriptionText}>
            Enter the phone number associated with your account
          </Text>
          <View style={styles.textInputView}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Code"
              value={countryCode}
              onChangeText={(text) => setCountryCode(text)}
              maxLength={4}
            />
            <TextInput
              style={styles.input2}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={number}
              onChangeText={(text) => setNumber(text)}
            />
          </View>
          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              {
                marginTop: 20,
                backgroundColor: number !== "" ? Colors.primary2 : Colors.gray,
                width: width * 0.8,
                alignSelf: "center",
                borderRadius: 15,
              },
            ]}
            onPress={() => onSignIn()}
          >
            {loading == true ? (
              <ActivityIndicator
                animating={true}
                color={Colors.white}
                size={20}
              />
            ) : (
              <Text style={defaultStyles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <Link href="/signup" replace asChild>
            <TouchableOpacity>
              <Text style={defaultStyles.textLink}>
                Do not have an account? sign up.
              </Text>
            </TouchableOpacity>
          </Link>
          {attemptInvisibleVerification && { recaptchaBanner }}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  kav: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  textInputView: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.white,
    paddingHorizontal: 10,
    width: 70,
    height: 40,
    borderRadius: 5,
    fontSize: 15,
    color: Colors.white,
  },
  input2: {
    borderWidth: 1,
    borderColor: Colors.white,
    paddingHorizontal: 10,
    width: width * 0.7,
    height: 40,
    borderRadius: 5,
    fontSize: 15,
    color: Colors.white,
  },
  enabled: { backgroundColor: Colors.primary },
  disabled: { backgroundColor: Colors.gray },
  errorText: {
    fontSize: 15,
    color: Colors.red,
    fontWeight: "500",
    bottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: Colors.darkTransparent,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.25,
    height: height * 0.15,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
