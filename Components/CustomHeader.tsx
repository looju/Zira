import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();
  const { width, height } = Dimensions.get("screen");
  return (
    <BlurView
      intensity={100}
      tint="systemThickMaterialDark"
      style={[styles.blur, { paddingTop: top }]}
    >
      <View style={[styles.container, {}]}>
        <TouchableOpacity
          style={[styles.rndBtn, { backgroundColor: Colors.primary2 }]}
        >
          <Text style={styles.prText}>OL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rndBtn2]}>
          <Text style={styles.prText}>Zira AI</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    gap: 10,
    paddingHorizontal: 20,
  },
  blur: {},
  rndBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rndBtn2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: Colors.primary,
    borderRightColor: Colors.primary2,
    borderBottomColor: Colors.green,
    borderTopColor: Colors.red,
    borderWidth: 1,
    alignSelf: "center",
  },
  prText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
