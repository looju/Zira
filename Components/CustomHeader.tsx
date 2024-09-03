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
import { Link, useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { width, height } = Dimensions.get("screen");

  return (
    <Animated.View entering={FadeIn.duration(2000)}>
      <BlurView
        intensity={100}
        tint="systemThickMaterialDark"
        style={[styles.blur, { paddingTop: top }]}
      >
        <View style={[styles.container, {}]}>
          <Link href={"/(modals)/account"} asChild style={styles.rndBtn}>
            <TouchableOpacity>
              <Ionicons name="person" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={[styles.rndBtn2]}>
            <Ionicons name="wallet" color={Colors.primary} size={22} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
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
    borderWidth: 1,
    borderColor: Colors.white,
  },
  rndBtn2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.white,
    borderWidth: 1,
    alignSelf: "center",
  },
  prText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
