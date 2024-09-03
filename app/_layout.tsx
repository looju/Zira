import "react-native-reanimated";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PaperProvider } from "react-native-paper";
import { NativeBaseProvider } from "native-base";
import { useEffect, useRef, useState } from "react";
import app from "Config/firebase";
import { Platform, TouchableOpacity, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { UserInactivityProvider } from "Context/UserInactivity";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

SplashScreen.preventAutoHideAsync();

const InitialNav = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const [isUser, setIsUser] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: Colors.primary,
        showBadge: true,
        bypassDnd: false,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
    return token;
  }

  useEffect(() => {
    SplashScreen.hideAsync();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUser(true);
        console.log(user, "usssser");
      } else {
        setIsUser(false);
        console.log("user is logged out");
      }
    });
    registerForPushNotificationsAsync()
      .then((token) => token && setExpoPushToken(token))
      .then(() => console.log("fetched token"))
      .catch((err) => console.log("error getting token", err));

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.black },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href="/help" asChild>
              <TouchableOpacity>
                <Ionicons
                  name="help-circle-outline"
                  size={25}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="confirmsignup"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.black },
          headerLeft: () => (
            <Link href="/login" asChild>
              <TouchableOpacity onPress={() => router.back}>
                <Ionicons name="arrow-back" size={20} color={Colors.white} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.black },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: "Help",
          headerBackTitle: "",
          headerShadowVisible: false,
          presentation: "modal",
          headerStyle: { backgroundColor: Colors.white },
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/lock"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="(modals)/account"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  const queryClient = new QueryClient();
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <UserInactivityProvider>
          <PaperProvider>
            <NativeBaseProvider>
              <InitialNav />
              {/* <Stack>
                <Stack.Screen
                  name="index"
                  options={{ headerShown: false, animation: "none" }}
                />
              </Stack> */}
              {/* <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: "black",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  hiiiiiiiiii
                </Text>
              </View> */}
            </NativeBaseProvider>
          </PaperProvider>
        </UserInactivityProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};
export default RootLayoutNav;
