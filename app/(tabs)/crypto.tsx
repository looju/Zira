import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GetListingsData } from "Services/Api/Listings";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { numberFormat } from "@/hooks/FormatNumbers";
import Colors from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import { Link } from "expo-router";
import CachedImage from "expo-cached-image";
import Image from "expo-cached-image";

const { width, height } = Dimensions.get("screen");

type RenderIconsProps = {
  image: string;
  id: number;
};
type RenderCoinProps = {
  name: string;
  price: any;
  symbol: string;
  change: number;
  id: number;
};

const Crypto = () => {
  const key = process.env.EXPO_PUBLIC_COINBASEKEY;
  const headerHeight = useHeaderHeight();
  const [ids, setIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const data = useQuery({
    queryKey: ["coinData"],
    queryFn: () =>
      axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=50`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": `${key}`,
          },
        }
      ),
  });

  const dataClient = data.data?.data.data.map((value) => {
    return {
      id: value.id,
    };
  });

  const ClientIds =
    dataClient?.length > 0
      ? Array.prototype.map.call(dataClient, (s) => s.id).toString()
      : 1;

  const dataIds = useQuery({
    queryKey: ["coinDataIds"],
    queryFn: () =>
      axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${ClientIds}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": `${key}`,
          },
        }
      ),
  });

  console.log(dataIds.isFetched, "jjjj");

  const onRefresh = () => {
    setRefreshing(true);
    data.refetch();
    dataIds.refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 5000);
  };

  const RenderCoins = ({
    name,
    price,
    symbol,
    change,
    id,
  }: RenderCoinProps) => (
    <Link
      href={{
        pathname: "/coins/coinDetails",
        params: { id: id, name: name.toLocaleUpperCase(), symbol: symbol },
      }}
      asChild
    >
      <TouchableOpacity style={styles.coinView}>
        <View style={styles.row}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>
            ${numberFormat.format(price.toFixed(2))}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text
            style={[
              styles.change,
              { color: Math.sign(change) == -1 ? Colors.red : Colors.green },
            ]}
          >
            {change.toFixed(5)}%
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  const RenderIcons = ({ image, id }: RenderIconsProps) => (
    <Image
      source={{ uri: image }}
      style={styles.image}
      resizeMode="cover"
      cacheKey={"disk"}
    />
  );

  return !dataIds.isFetched ? (
    <View style={styles.indView}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: headerHeight,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <>
            {!data.data && (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.ind}
              />
            )}
            {dataIds == undefined && (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.ind}
              />
            )}
            <FlatList
              data={
                dataIds !== undefined
                  ? Object.keys(dataIds?.data?.data.data)
                  : []
              }
              renderItem={({ item }) => (
                <RenderIcons
                  image={dataIds.data?.data.data[item].logo}
                  id={dataIds.data?.data.data[item].id}
                />
              )}
              keyExtractor={(item) => dataIds.data?.data.data[item].id}
              scrollEnabled={false}
            />
            <FlatList
              data={data.data?.data.data}
              renderItem={({ item }) => (
                <RenderCoins
                  name={item.name}
                  price={item.quote.USD.price}
                  symbol={item.symbol}
                  change={item.quote.USD.percent_change_1h}
                  id={item.id}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Crypto;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: Colors.black,
    flex: 1,
  },
  image: {
    width: 40,
    height: 40,
    marginVertical: 17,
    justifyContent: "center",
  },
  item: {},
  iconView: {
    marginVertical: 10,
  },
  coinView: {
    width: width * 0.75,
    marginVertical: 17,
    height: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  symbol: {
    fontSize: 14,
    fontWeight: "300",
    color: Colors.white,
  },
  change: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ind: {
    alignSelf: "center",
    flex: 1,
  },
  indView: {
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: Colors.black,
  },
});
