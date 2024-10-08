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
  ActivityIndicator,
  KeyboardEvent,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { useFirebaseLogin } from "@itzsunny/firebase-login";
import app from "../Config/firebase";
import { getAuth } from "firebase/auth";
import { FirebaseOptions } from "firebase/app";
import { Validation } from "@/hooks/numbervalidation";
import { useCodeStore } from "store/CodeStore";

const { width, height } = Dimensions.get("screen");

const Signup = () => {
  const [countryCode, setCountryCode] = useState("");
  const [number, setNumber] = useState("");
  const [errrorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
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

  const onSignup = async () => {
    setLoading(true);
    const fullNumber = countryCode + number;
    Validation({ fullNumber: fullNumber }).then(async (data) => {
      if (data.valid !== true) {
        setErrorMessage("Invalid phone number. Please try again.");
        return;
      }
      //send verfication code to phone number
      try {
        // const provider = new PhoneAuthProvider(auth);
        const verificationCode = await sendOtp(fullNumber);
        if (verificationCode !== null) {
          setLoading(false);
          route.navigate({
            pathname: "/confirmsignup",
            params: {
              serverCode: verificationCode,
              fullNumber: fullNumber,
              country: data.country,
            },
          });
        }
      } catch (error) {
        console.log(error, "error sending code");
      }
    });
  };

  useEffect(() => {
    function onKeyboardDidShow(e: KeyboardEvent) {
      // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  console.log(keyboardHeight);

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 70 : keyboardHeight * 0.6}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.kav}>
        <View style={defaultStyles.container}>
          {recaptcha}
          <Text style={defaultStyles.header}>Let's get started!</Text>
          <Text style={defaultStyles.descriptionText}>
            Enter a valid phone number to receive a confirmation code
          </Text>
          <View style={styles.textInputView}>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              placeholder="CC"
              value={countryCode}
              onChangeText={(text) => setCountryCode(text)}
              maxLength={4}
              placeholderTextColor={Colors.gray2}
            />
            <TextInput
              style={styles.input2}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.gray2}
              keyboardType="phone-pad"
              value={number}
              onChangeText={(text) => setNumber(text)}
            />
          </View>
          {errrorMessage !== "" && (
            <Text style={styles.errorText}>{errrorMessage}</Text>
          )}
          <Link href="/login" replace asChild>
            <TouchableOpacity>
              <Text style={defaultStyles.textLink}>
                Already have an account? Log in.
              </Text>
            </TouchableOpacity>
          </Link>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              {
                marginTop: 20,
                backgroundColor:
                  number !== "" && countryCode !== ""
                    ? Colors.primary2
                    : Colors.gray,
                width: width * 0.8,
                alignSelf: "center",
                borderRadius: 15,
                paddingBottom: 0,
              },
            ]}
            onPress={onSignup}
            disabled={(number === "" && countryCode === "") || loading}
          >
            {loading == true ? (
              <ActivityIndicator
                animating={true}
                color={Colors.white}
                size={20}
              />
            ) : (
              <Text style={defaultStyles.buttonText}>Sign up</Text>
            )}
          </TouchableOpacity>
          {attemptInvisibleVerification && { recaptchaBanner }}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Signup;

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
});
