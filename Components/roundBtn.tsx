import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import Colors from "@/constants/Colors";

const { width, height } = Dimensions.get("screen");

type btnProps = {
  text: string;
  onPress: () => void;
  icon: string;
};

const RoundBtn = ({ icon, text, onPress }: btnProps) => {
  return (
    <Button
      mode="outlined"
      icon={icon}
      onPress={onPress}
      style={styles.btn}
      contentStyle={styles.content}
      labelStyle={styles.label}
      compact
      rippleColor={Colors.gray3}
    >
      {text}
    </Button>
  );
};

export default RoundBtn;

const styles = StyleSheet.create({
  btn: {
    width: width * 0.3,
    alignContent: "flex-start",
    borderColor: Colors.primary,
  },
  label: {
    color: Colors.white,
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    padding: 0,
  },
});
