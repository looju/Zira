/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
} from "react-native";
import SortableList from "react-native-sortable-list";

const window = Dimensions.get("window");

const data = {
  0: {
    image: "https://placekitten.com/200/240",
    text: "Chloe",
  },
  1: {
    image: "https://placekitten.com/200/201",
    text: "Jasper",
  },
  2: {
    image: "https://placekitten.com/200/202",
    text: "Pepper",
  },
  3: {
    image: "https://placekitten.com/200/203",
    text: "Oscar",
  },
  4: {
    image: "https://placekitten.com/200/204",
    text: "Dusty",
  },
  5: {
    image: "https://placekitten.com/200/205",
    text: "Spooky",
  },
  6: {
    image: "https://placekitten.com/200/210",
    text: "Kiki",
  },
  7: {
    image: "https://placekitten.com/200/215",
    text: "Smokey",
  },
  8: {
    image: "https://placekitten.com/200/220",
    text: "Gizmo",
  },
  9: {
    image: "https://placekitten.com/220/239",
    text: "Kitty",
  },
};

export default function Horizontal() {
  const renderRow = useCallback(({ data, active }) => {
    return <Row data={data} active={active} />;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Sortable List</Text>
      <SortableList
        horizontal
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={data}
        renderRow={renderRow}
      />
    </View>
  );
}

function Row(props) {
  const { active, data } = props;

  const activeAnim = useRef(new Animated.Value(0));
  const style = useMemo(
    () => ({
      ...Platform.select({
        ios: {
          transform: [
            {
              scale: activeAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            },
          ],
          shadowRadius: activeAnim.current.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [
            {
              scale: activeAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            },
          ],
          elevation: activeAnim.current.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      }),
    }),
    []
  );
  useEffect(() => {
    Animated.timing(activeAnim.current, {
      duration: 300,
      easing: Easing.bounce,
      toValue: Number(active),
      useNativeDriver: true,
    }).start();
  }, [active]);

  return (
    <Animated.View style={[styles.row, style]}>
      <Image source={{ uri: data.image }} style={styles.image} />
      <Text style={styles.text}>{data.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },

  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: "#999999",
  },

  list: {
    height: 210,
    width: window.width,
  },

  contentContainer: {
    ...Platform.select({
      ios: {
        paddingVertical: 30,
      },

      android: {
        paddingVertical: 0,
      },
    }),
  },

  row: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    width: 110,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 4,

    ...Platform.select({
      ios: {
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
      },

      android: {
        elevation: 0,
        marginHorizontal: 30,
      },
    }),
  },

  image: {
    width: 50,
    height: 50,
    marginBottom: 15,
    borderRadius: 25,
  },

  text: {
    fontSize: 18,
    color: "#222222",
  },
});
