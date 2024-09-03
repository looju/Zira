/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(modals)/account` | `/(modals)/lock` | `/(tabs)` | `/(tabs)/chat` | `/(tabs)/crypto` | `/(tabs)/home` | `/_sitemap` | `/account` | `/chat` | `/coins/coinDetails` | `/confirmsignup` | `/crypto` | `/help` | `/home` | `/lock` | `/login` | `/signup`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
