import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import getSymbolFromCurrency from "currency-symbol-map";
import RoundBtn from "Components/roundBtn";
import Dropdown from "Components/dropdown";
import { useCodeStore } from "store/CodeStore";
import { useBalanceStore } from "store/BalanceStore";
import { nanoid } from "nanoid/non-secure";
import moment from "moment";
import { defaultStyles } from "@/constants/Styles";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Horizontal from "Components/SortableList";
import WidgetList from "Components/SortableList/WidgetList";
import { useHeaderHeight } from "@react-navigation/elements";

const { width, height } = Dimensions.get("screen");

const Home = () => {
  const countryCode = useCodeStore((state) => state.code);
  const headerHeight = useHeaderHeight();
  const { balance, transactions, runTransaction, clearTransaction, title } =
    useBalanceStore();
  const currency = getSymbolFromCurrency(countryCode);
  const numberFormat = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  });
  const generateRndAmount =
    Math.floor(Math.random() * 2700) * (Math.random() > 0.5 ? 1 : -1);
  const dynTitle =
    transactions.length == 0
      ? "First trx"
      : Math.sign(generateRndAmount) == -1
        ? "Withdrawal"
        : "Deposit";
  const addMoney = () => {
    runTransaction({
      id: nanoid(),
      date: Date.now(),
      amount: generateRndAmount,
      title: dynTitle,
    });
  };

  return (
    <ScrollView
      style={styles.main}
      contentContainerStyle={{ paddingTop: headerHeight * 0.4 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{numberFormat.format(balance())}</Text>
          <Text style={styles.currency}>{currency}</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <RoundBtn
          text={"Add money"}
          icon="bank-plus"
          onPress={() => addMoney()}
        />
        <RoundBtn
          text={"Exchange"}
          icon="swap-horizontal"
          onPress={() => clearTransaction()}
        />
        <Dropdown />
      </View>
      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      {transactions.length === 0 && (
        <Text style={styles.noTrx}>No transactions yet.</Text>
      )}
      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transaction}>
          <Text style={styles.date}>
            {moment(transaction.date).format("ddd, MMMM Do YYYY, h:mm a")}
          </Text>
          <View style={styles.desc}>
            {transaction.title == "First trx" &&
              Math.sign(transaction.amount) == -1 && (
                <View style={styles.descRow}>
                  <MaterialCommunityIcons
                    name="bank-transfer-out"
                    size={24}
                    color={Colors.red}
                  />
                  <Text style={styles.descText}>
                    Your first trx action, withdrawal of{" "}
                    <Text style={styles.amount2}>
                      {currency}
                      {numberFormat.format(transaction.amount)}
                    </Text>{" "}
                    successful
                  </Text>
                </View>
              )}
            {transaction.title == "First trx" &&
              Math.sign(transaction.amount) == 1 && (
                <View style={styles.descRow}>
                  <MaterialCommunityIcons
                    name="bank-transfer-in"
                    size={24}
                    color={Colors.green}
                  />
                  <Text style={styles.descText}>
                    Your first trx action, deposit of{" "}
                    <Text style={styles.amount}>
                      {currency}
                      {numberFormat.format(transaction.amount)}
                    </Text>{" "}
                    successful
                  </Text>
                </View>
              )}
            {transaction.title == "Deposit" && (
              <>
                <View style={styles.descRow}>
                  <MaterialCommunityIcons
                    name="bank-transfer-in"
                    size={24}
                    color={Colors.green}
                  />
                  <Text style={styles.descText}>
                    Deposit action of{" "}
                    <Text style={styles.amount}>
                      {currency}
                      {numberFormat.format(transaction.amount)}
                    </Text>{" "}
                    successful
                  </Text>
                </View>
              </>
            )}
            {transaction.title == "Withdrawal" && (
              <>
                <View style={styles.descRow}>
                  <MaterialCommunityIcons
                    name="bank-transfer-out"
                    size={24}
                    color={Colors.red}
                  />
                  <Text style={styles.descText}>
                    Withdrawal action of{" "}
                    <Text style={styles.amount2}>
                      {currency}
                      {numberFormat.format(transaction.amount)}
                    </Text>{" "}
                    successful
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      ))}
      {/* <Horizontal /> */}
      <WidgetList />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.black,
  },
  account: {
    marginTop: 80,
    marginBottom: 30,
    alignItems: "center",
  },
  row: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    width: width,
  },
  balance: {
    fontSize: 60,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
  },
  currency: {
    fontSize: 25,
    fontWeight: "300",
    color: Colors.white,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: width,
    paddingHorizontal: 10,
  },
  noTrx: {
    color: Colors.white,
    textAlign: "left",
    marginTop: 20,
    marginBottom: 50,
    fontStyle: "italic",
    paddingLeft: width * 0.05,
  },
  transaction: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: width * 0.05,
    marginBottom: 40,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    height: 80,
    justifyContent: "space-evenly",
  },
  date: {
    color: Colors.white,
  },
  desc: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width,
  },
  descText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
    maxWidth: width * 0.8,
    lineHeight: 20,
    top: 2,
    left: width * 0.05,
  },

  descRow: {
    flexDirection: "row",
    width: width,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  amount: {
    color: Colors.green,
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 5,
  },
  amount2: {
    color: Colors.red,
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 5,
  },
});
