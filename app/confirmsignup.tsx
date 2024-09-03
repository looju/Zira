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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { FirebaseOptions } from "firebase/app";
import app from "../Config/firebase";
import { db } from "../Config/firebase";
import { getAuth } from "firebase/auth";
import { ref, push } from "firebase/database";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useFirebaseLogin } from "@itzsunny/firebase-login";
import { useCodeStore } from "store/CodeStore";

const { width, height } = Dimensions.get("screen");

const ConfirmSignup = () => {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const codeRef = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const auth = getAuth(app);
  const route = useRouter();
  const { serverCode, fullNumber, country } = useLocalSearchParams();
  const firebaseConfig: FirebaseOptions | undefined = app
    ? app.options
    : undefined;
  const { recaptcha, recaptchaBanner, sendOtp, verifyOtp } = useFirebaseLogin({
    auth: auth,
    firebaseConfig: firebaseConfig,
  });
  const addCountryCode = useCodeStore((state) => state.addCode);
  const addNumber = useCodeStore((state) => state.addNumber);
  const addID = useCodeStore((state) => state.addId);

  const onHandleConfirmationCode = async () => {
    setLoading(true);
    if (value.length < 6) return;
    try {
      const verifyCode = await verifyOtp(serverCode, value);
      console.log(verifyCode, "verify code res ");
      if (verifyCode !== null) {
        setLoading(false);
        //save to db
        const userData = {
          id: verifyCode.user.uid,
          number: fullNumber,
          country: country,
        };
        push(ref(db, "/users"), userData);
        addCountryCode(userData.country);
        addNumber(fullNumber);
        addID(userData.id);
        route.replace("/(tabs)/home");
      }
    } catch (error) {
      setErrorMessage("Invalid code");
      console.log(error, "error sending code");
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={defaultStyles.container}>
          <Text style={defaultStyles.header}>Almost there!</Text>
          <Text style={defaultStyles.descriptionText}>
            Enter the code sent to {fullNumber}
          </Text>
          <View style={styles.textInputView}>
            <CodeField
              ref={codeRef}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={6}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
          {errorMessage !== " " && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              {
                marginTop: 20,
                backgroundColor: value !== "" ? Colors.primary2 : Colors.gray,
                width: width * 0.8,
                alignSelf: "center",
                borderRadius: 15,
              },
            ]}
            onPress={() => onHandleConfirmationCode()}
          >
            {loading == true ? (
              <ActivityIndicator
                animating={true}
                color={Colors.white}
                size={20}
              />
            ) : (
              <Text style={defaultStyles.buttonText}>Proceed</Text>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ConfirmSignup;

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
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 0 },
  cell: {
    width: 40,
    height: 40,
    borderRadius: 10,
    gap: 10,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1.5,
    borderColor: Colors.white,
    textAlign: "center",
    marginHorizontal: 2,
    color: Colors.white,
    fontFamily: "Helvetica",
  },
  focusCell: {
    borderColor: Colors.primary,
  },
  errorText: {
    fontSize: 15,
    color: Colors.red,
    fontWeight: "500",
    bottom: 20,
  },
});
