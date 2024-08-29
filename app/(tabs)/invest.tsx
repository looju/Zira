import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

const { height } = Dimensions.get("screen");
const Invest = () => {
  return (
    <View>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={styles.ind}
      />
    </View>
  );
};

export default Invest;

const styles = StyleSheet.create({
  ind: {
    alignSelf: "center",
    justifyContent: "center",
    marginTop: height * 0.4,
  },
});
