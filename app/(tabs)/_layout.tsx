import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import CustomHeader from "Components/CustomHeader";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarBackground: () => (
          <BlurView
            style={{ flex: 1 }}
            intensity={100}
            tint="systemMaterialDark"
          />
        ),
        tabBarStyle: {
          backgroundColor: "transparent",
          bottom: 0,
          left: 0,
          right: 0,
          position: "absolute",
          elevation: 0,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome size={focused ? 33 : 24} name="home" color={color} />
          ),
          header: () => <CustomHeader />,
          headerTransparent: true,
        }}
      />
      <Tabs.Screen
        name="crypto"
        options={{
          title: "Crypto",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={focused ? 33 : 24}
              name="bitcoin"
              color={color}
            />
          ),
          headerTitle: "Latest Crypto",
          headerTransparent: true,
          headerBackground: (props) => (
            <BlurView
              style={{ flex: 1 }}
              intensity={100}
              tint="systemUltraThinMaterialDark"
            />
          ),
          headerTitleStyle: { color: Colors.white },
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: "Invest",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={focused ? 33 : 24}
              name="line-chart"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: "Transfers",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={focused ? 33 : 24}
              name="exchange"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome size={focused ? 33 : 24} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
