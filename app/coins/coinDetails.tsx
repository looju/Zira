import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { useQuery } from "@tanstack/react-query";
import { useHeaderHeight } from "@react-navigation/elements";
import axios from "axios";
import { defaultStyles } from "@/constants/Styles";

const { height, width } = Dimensions.get("screen");

const CoinDetails = () => {
  const { id, name, symbol } = useLocalSearchParams();
  const router = useRouter();
  const key = process.env.EXPO_PUBLIC_COINBASEKEY;
  const headerHeight = useHeaderHeight();
  const categories = ["Overview", "News", "Order", "Transactions"];
  const [activeIndex, setActiveIndex] = useState(0);
  const data = useQuery({
    queryKey: ["coinDetails"],
    queryFn: () =>
      axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${id}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": `${key}`,
          },
        }
      ),
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: `${name}`,
          headerTitleStyle: {
            color: Colors.white,
            fontSize: 15,
            fontWeight: "bold",
          },
          headerTransparent: true,
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color={Colors.primary}
              onPress={router.back}
            />
          ),
          headerRight: () => (
            <Octicons name="star" size={24} color={Colors.white} />
          ),

          headerBackground: () => (
            <BlurView intensity={100} tint="dark" style={{ flex: 1 }} />
          ),
        }}
      />
      {!data.isFetched ? (
        <View style={styles.indView}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <SectionList
          sections={[{ data: [{ title: "Chart" }] }]}
          contentInsetAdjustmentBehavior="automatic"
          style={{
            paddingTop: headerHeight * 0.3,
            backgroundColor: Colors.black,
          }}
          renderSectionHeader={() => (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesBtn}
              style={{ marginTop: height * 0.1, bottom: height * 0.03 }}
            >
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveIndex(index)}
                  style={
                    index === activeIndex
                      ? styles.categoriesBtnActive
                      : styles.categoriesBtn2
                  }
                >
                  <Text style={styles.btnTxt}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          ListHeaderComponent={() => (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: 16,
                }}
              >
                <Text style={styles.subtitle}>SYMBOL: {symbol}</Text>
                <Image
                  source={{ uri: Object.values(data?.data?.data.data)[0].logo }}
                  style={{ width: 60, height: 60 }}
                  cachePolicy={"none"}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 10, margin: 12 }}>
                <TouchableOpacity
                  style={[
                    defaultStyles.pillButtonSmall,
                    {
                      backgroundColor: Colors.primary,
                      flexDirection: "row",
                      gap: 16,
                    },
                  ]}
                >
                  <Ionicons name="add" size={24} color={"#fff"} />
                  <Text
                    style={[defaultStyles.buttonText, { color: Colors.black }]}
                  >
                    Buy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    defaultStyles.pillButtonSmall,
                    {
                      backgroundColor: Colors.primaryMuted,
                      flexDirection: "row",
                      gap: 16,
                    },
                  ]}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={Colors.primary}
                  />
                  <Text
                    style={[
                      defaultStyles.buttonText,
                      { color: Colors.primary },
                    ]}
                  >
                    Receive
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          renderItem={({ item }) => (
            <>
              <View style={styles.chartView}></View>
              <View
                style={[
                  defaultStyles.block,
                  { marginTop: 20, backgroundColor: Colors.black },
                ]}
              >
                <Text style={styles.subtitle}>Overview</Text>
                <Text style={styles.desc}>Coin description goes here</Text>
              </View>
            </>
          )}
        />
      )}
    </>
  );
};

export default CoinDetails;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.white,
  },
  ind: {
    alignSelf: "center",
    marginTop: height * 0.4,
  },
  sticky: {},
  desc: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.white,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.white,
  },
  indView: {
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: Colors.black,
  },
  categoriesBtn: {
    alignItems: "center",
    justifyContent: "space-evenly",
    width: width,
    borderBottomColor: Colors.gray2,
    borderBottomWidth: 0.5,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: "#000",
  },
  categoriesBtn2: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  chartView: {
    height: height * 0.7,
    backgroundColor: Colors.gray,
  },
});
