export default {
  expo: {
    name: "Zira",
    slug: "Zira",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "Zira",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.loju.Zira",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.loju.Zira",
    },
    web: {
      bundler: "metro",
      output: "server",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://loju.dev/",
        },
      ],
      "expo-asset",
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Allow Zira to use Face ID.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
  extra: {
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASEKEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASEAUTHDOMIAN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASEPROJECTID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASESTORAGEBUCKET,
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASESENDERID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASEAPPID,
  },
};
