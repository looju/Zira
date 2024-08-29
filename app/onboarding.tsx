import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import { useAssets } from "expo-asset";
import { ResizeMode, Video } from "expo-av";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { defaultStyles } from "@/constants/Styles";

const { height, width } = Dimensions.get("screen");

const OnBoarding = () => {
  const [assets, error] = useAssets([require("../assets/video/video2.mp4")]);
  return (
    <View style={styles.container}>
      {assets && (
        <Video
          source={{ uri: assets[0].uri }}
          style={styles.video}
          isLooping
          isMuted
          shouldPlay
          resizeMode={ResizeMode.COVER}
        />
      )}
      <View style={styles.leadTextView}>
        <Text style={styles.leadText}>Ready to change how you move money?</Text>
      </View>
      <View style={{ flex: 0.9 }} />
      <View style={styles.buttons}>
        <Link href="/login" asChild style={defaultStyles.pillButton}>
          <TouchableOpacity
            style={defaultStyles.pillButton}
            activeOpacity={0.1}
          >
            <Text style={styles.btnText1}>Login</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/signup" asChild style={defaultStyles.pillButton}>
          <TouchableOpacity
            style={defaultStyles.pillButton}
            activeOpacity={0.1}
          >
            <Text style={[styles.btnText1, { fontSize: 12 }]}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
