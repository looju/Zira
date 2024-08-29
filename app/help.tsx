import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const Help = () => {
  return (
    <ScrollView
      style={[defaultStyles.container, { backgroundColor: Colors.white }]}
    >
      <Text style={styles.text}>
        Welcome to Zira, where managing your finances becomes simpler, smarter,
        and more secure. Designed to meet the needs of today’s tech-savvy users,
        our fintech application offers a range of features to help you take
        control of your financial health with ease. What Zira Offers:
      </Text>
      <View style={styles.view1}>
        <Text style={styles.text}>
          Unified Financial Dashboard: Gain a comprehensive view of your
          financial life by linking all your accounts in one place. Monitor your
          bank accounts, credit cards, and investments effortlessly with our
          intuitive dashboard. Personalized Budgeting Tools: Set and track your
          budgets with our user-friendly tools. [Your App Name] helps you
          categorize expenses, monitor spending habits, and receive tailored
          recommendations to stay on track with your financial goals.
        </Text>
      </View>
      <View style={styles.view1}>
        <Text style={styles.text}>
          Automated Savings: Make saving automatic and hassle-free. Set your
          savings goals, and our app will automatically transfer funds into your
          savings account, helping you build your savings effortlessly over
          time.
        </Text>
      </View>
      <View style={styles.view1}>
        <Text style={styles.text}>
          For more information about terms of use, contact the developer at
          <Text style={{ fontWeight: "bold" }}> omofade2019@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default Help;

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    marginVertical: 10,
    paddingEnd: 10,
    textAlign: "center",
  },
  text: {
    textAlign: "justify",
  },
});
