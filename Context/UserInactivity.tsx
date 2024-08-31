import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log(nextAppState);

    if (nextAppState == "background") {
      recordStartTime();
    } else if (
      nextAppState == "active" &&
      appState.current.match(/background/)
    ) {
      try {
        const startTime = await AsyncStorage.getItem("start-time");
        if (startTime !== null) {
          const elapsedTime = Date.now() - Number(startTime);
          if (elapsedTime > 10000) {
            console.log(true);
            router.replace({
              pathname: "/onboarding",
              params: {
                sessionExpired: "true",
              },
            });
          }
        }
      } catch (error) {
        console.log(error, "error reading start time of user");
      }
    }
    appState.current = nextAppState;
  };

  const recordStartTime = async () => {
    try {
      await AsyncStorage.setItem("start-time", Date.now().toString());
    } catch (e) {
      // saving error
    }
  };

  return children;
};
