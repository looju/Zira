import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import LottieView from "lottie-react-native";
import { MARGIN, SIZE } from "./Config";
import Colors from "@/constants/Colors";
import { useBalanceStore } from "store/BalanceStore";
import { Ionicons } from "@expo/vector-icons";
import { useCodeStore } from "store/CodeStore";
import getSymbolFromCurrency from "currency-symbol-map";

const styles = StyleSheet.create({
  container: {
    width: SIZE - 10,
    height: 150,
    backgroundColor: Colors.black,
    borderRadius: 20,
    shadowColor: Colors.primary2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    padding: 10,
    alignSelf: "center",
    borderColor: Colors.primary2,
    borderWidth: 1,
    alignItems: "center",
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    position: "absolute",
    zIndex: 1000,
  },
});
interface TileProps {
  id: string;
  uri?: string;
  onLongPress: () => void;
}

const Tile = ({ id }: TileProps) => {
  const { transactions } = useBalanceStore();
  const countryCode = useCodeStore((state) => state.code);
  const currency = getSymbolFromCurrency(countryCode);
  const numberFormat = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  });
  const colorCode =
    transactions.length > 0
      ? transactions[transactions.length - 1].title == "Deposit"
        ? `${Colors.green}`
        : transactions[transactions.length - 1].title == "Withdrawal"
          ? `${Colors.red}`
          : `${Colors.white}`
      : `${Colors.lightGray}`;

  const allTrx =
    transactions.length > 0
      ? transactions.map((transaction) => transaction.amount)
      : null;
  const maxTrx = allTrx !== null ? Math.max(...allTrx) : 0.0;
  const formatMaxTrx = numberFormat.format(maxTrx);
  const dynTrx =
    maxTrx !== null
      ? Math.sign(maxTrx) == 1
        ? "Positive"
        : "Negative"
      : "Neutral";
  const json =
    transactions.length > 0
      ? dynTrx == "Negative"
        ? require("../../assets/lottie/anim1.json")
        : dynTrx == "Positive"
          ? require("../../assets/lottie/anim3.json")
          : require("../../assets/lottie/anim1.json")
      : require("../../assets/lottie/anim1.json");
  if (id === "spent") {
    return (
      <>
        <View style={styles.container} pointerEvents="none">
          {dynTrx == "Negative" && (
            <LottieView
              autoPlay
              loop
              useNativeLooping
              style={{
                width: 150,
                height: 100,
              }}
              source={json}
            />
          )}
          {dynTrx == "Positive" && (
            <LottieView
              autoPlay
              loop
              useNativeLooping
              style={{
                width: 250,
                height: 250,
                alignSelf: "center",
                bottom: 15,
              }}
              source={json}
            />
          )}

          <Text
            style={{
              color: Colors.white,
              fontWeight: "bold",
              fontSize: 16,
              position: "absolute",
            }}
          >
            Biggest trx
          </Text>
          <View
            style={[
              styles.circle,
              {
                backgroundColor:
                  dynTrx == "Positive"
                    ? Colors.green
                    : dynTrx == "Negative"
                      ? Colors.red
                      : dynTrx == "Neutral"
                        ? `${Colors.lightGray}`
                        : `${Colors.lightGray}`,
              },
            ]}
          >
            <Text
              style={{
                color: Colors.white,
                fontWeight: "bold",
                fontSize: 15,
                paddingTop: 10,
                position: "absolute",
              }}
            >
              {currency}
              {formatMaxTrx}
            </Text>
          </View>
        </View>
      </>
    );
  }

  if (id === "cashback") {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
        pointerEvents="none"
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", gap: 10 }}
        >
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              5%
            </Text>
          </View>
          <Text
            style={{ color: Colors.gray, fontWeight: "bold", fontSize: 18 }}
          >
            Cashback
          </Text>
        </View>
      </View>
    );
  }

  if (id === "recent") {
    return (
      <View style={styles.container} pointerEvents="none">
        <View>
          <Text
            style={{ color: Colors.white, fontWeight: "800", fontSize: 16 }}
          >
            Recent transaction
          </Text>

          {transactions.length === 0 && (
            <Text
              style={{
                color: Colors.white,
                fontWeight: "500",
                fontSize: 18,
                paddingTop: 10,
              }}
            >
              No transactions.
            </Text>
          )}

          {transactions.length > 0 && (
            <>
              <Text
                style={{
                  color: Colors.white,
                  fontWeight: "700",
                  fontSize: 16,
                  top: 10,
                }}
              >
                {transactions[transactions.length - 1].title}
              </Text>
              <Text
                style={{
                  color: colorCode,
                  fontWeight: "bold",
                  fontSize: 18,
                  paddingVertical: 10,
                }}
              >
                {currency}
                {numberFormat.format(
                  transactions[transactions.length - 1].amount
                )}
              </Text>
            </>
          )}
        </View>
      </View>
    );
  }

  if (id === "cards") {
    return (
      <View style={styles.container} pointerEvents="none">
        <Text style={{ color: Colors.white, fontWeight: "bold", fontSize: 16 }}>
          Cards
        </Text>
        <Ionicons
          name="card"
          size={50}
          color={Colors.primaryMuted}
          style={{ marginTop: 20, alignSelf: "center" }}
        />
      </View>
    );
  }
};

export default Tile;
