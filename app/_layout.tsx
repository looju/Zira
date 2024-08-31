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
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { UserInactivityProvider } from "Context/UserInactivity";

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen
        name="onboarding"
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
            <Link href="/onboarding" asChild>
              <TouchableOpacity onPress={() => router.back}>
                <Ionicons name="arrow-back" size={20} color={Colors.white} />
              </TouchableOpacity>
            </Link>
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
            <Link href="/onboarding" asChild>
              <TouchableOpacity onPress={() => router.back}>
                <Ionicons name="arrow-back" size={20} color={Colors.white} />
              </TouchableOpacity>
            </Link>
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
    </Stack>
  );
};

const Layout = () => {
  const queryClient = new QueryClient();
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <UserInactivityProvider>
          <PaperProvider>
            <NativeBaseProvider>
              <RootLayoutNav />
            </NativeBaseProvider>
          </PaperProvider>
        </UserInactivityProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};
export default Layout;
