import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import {
  Select,
  Center,
  Box,
  CheckIcon,
  Menu,
  HamburgerIcon,
} from "native-base";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("screen");

const Dropdown = () => {
  const [service, setService] = useState("");
  return (
    <Menu
      w="190"
      trigger={(triggerProps) => {
        return (
          <TouchableOpacity
            accessibilityLabel="More options menu"
            {...triggerProps}
            style={styles.touch}
          >
            <Ionicons name="menu" color={Colors.white} />
            <View>
              <Text style={styles.text}>More</Text>
            </View>
          </TouchableOpacity>
        );
      }}
    >
      <Menu.Item>Chat with Zira Ai 👋</Menu.Item>
    </Menu>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  select: {
    width: width * 0.1,
  },
  touch: {
    width: width * 0.3,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    padding: 10,
    elevation: 2,
    gap: 10,
    borderColor: Colors.primary,
    borderWidth: 1,
    height: 60,
  },
  text: {
    color: Colors.white,
  },
});
