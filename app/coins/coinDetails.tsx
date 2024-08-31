import {
  ActivityIndicator,
  Dimensions,
  Linking,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { lineDataItem } from "react-native-gifted-charts";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Entypo,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { useQuery } from "@tanstack/react-query";
import { useHeaderHeight } from "@react-navigation/elements";
import axios from "axios";
import { LineChart } from "react-native-gifted-charts";
import { defaultStyles } from "@/constants/Styles";
import { numberFormat } from "@/hooks/FormatNumbers";
import { RandomPrices } from "@/hooks/RandomPrices";
import moment from "moment";

const { height, width } = Dimensions.get("screen");

const CoinDetails = () => {
  const { id, name, symbol, price } = useLocalSearchParams();
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
          showsVerticalScrollIndicator={false}
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
              <View style={styles.chartView}>
                <LineChart
                  data={RandomPrices(price)}
                  color="#fff"
                  thickness={3}
                  dataPointsColor={Colors.white}
                  initialSpacing={10}
                  spacing={30}
                  yAxisColor={Colors.white}
                  xAxisColor={Colors.white}
                  xAxisThickness={1.5}
                  yAxisThickness={1.5}
                  hideRules
                  height={height * 0.5}
                  yAxisIndicesColor={Colors.white}
                  yAxisLabelPrefix="$"
                  yAxisTextStyle={{ color: Colors.white }}
                  yAxisLabelWidth={50}
                  xAxisLabelTextStyle={{ color: Colors.white }}
                  curved
                  curvature={0.25}
                  scrollToEnd={true}
                  isAnimated
                  width={width}
                  lineGradient
                  lineGradientStartColor={Colors.primary}
                  lineGradientEndColor={Colors.primary2}
                  focusEnabled
                  showTextOnFocus
                  showDataPointLabelOnFocus
                  focusedDataPointColor={Colors.red}
                  focusedDataPointHeight={50}
                  focusedDataPointShape="square"
                  textColor={Colors.white}
                  textFontSize={12}
                />
              </View>
              <View
                style={[
                  defaultStyles.block,
                  { marginTop: 20, backgroundColor: Colors.black },
                ]}
              >
                <Text style={styles.semiHeaders}>Overview</Text>
                <Text style={styles.desc}>
                  {Object.values(data?.data?.data.data)[0]
                    .description.replace(/\s+/g, " ")
                    .trim()}
                </Text>
                <Text style={styles.semiHeaders}>Launched</Text>
                <Text style={styles.desc}>
                  {moment(
                    Object.values(data?.data?.data.data)[0].date_added
                  ).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </Text>
                <View>
                  <Text style={styles.semiHeaders}>Tags</Text>
                  {Object.values(data?.data?.data.data)[0].tags.map(
                    (name: string) => (
                      <View>
                        <Text style={styles.tags}>- {name}</Text>
                      </View>
                    )
                  )}
                </View>
                <Text style={styles.semiHeaders}>Official Channels</Text>
                <View style={[styles.iconsRow]}>
                  <Foundation
                    name="web"
                    size={30}
                    color={Colors.white}
                    onPress={async () =>
                      await Linking.openURL(
                        Object.values(data?.data?.data.data)[0].urls.website[0]
                      )
                    }
                  />
                  <Ionicons
                    name="newspaper-outline"
                    size={30}
                    color={Colors.white}
                    onPress={async () =>
                      await Linking.openURL(
                        Object.values(data?.data?.data.data)[0].urls
                          .technical_doc[0]
                      )
                    }
                  />
                  <Entypo
                    name="twitter"
                    size={30}
                    color={Colors.blue}
                    onPress={async () =>
                      await Linking.openURL(
                        Object.values(data?.data?.data.data)[0].urls.twitter[0]
                      )
                    }
                  />
                  <FontAwesome5
                    name="reddit"
                    size={30}
                    color={Colors.red}
                    onPress={async () =>
                      await Linking.openURL(
                        Object.values(data?.data?.data.data)[0].urls.reddit[0]
                      )
                    }
                  />
                </View>
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
    width: width * 0.8,
    textAlign: "justify",
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
    height: height * 0.55,
    backgroundColor: Colors.black,
    alignSelf: "flex-start",
    alignItems: "center",
    marginBottom: 30,
  },
  semiHeaders: {
    color: Colors.white,
    fontWeight: "800",
    fontSize: 18,
  },
  tags: {
    marginHorizontal: 5,
    width: width * 0.9,
    textAlign: "justify",
    color: Colors.white,
    marginTop: 10,
  },
  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
    marginVertical: 10,
    marginBottom: height * 0.05,
  },
});
