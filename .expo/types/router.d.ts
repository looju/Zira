/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(modals)/lock` | `/(tabs)` | `/(tabs)/crypto` | `/(tabs)/home` | `/(tabs)/invest` | `/(tabs)/settings` | `/(tabs)/transfers` | `/_layout2` | `/_sitemap` | `/coins/coinDetails` | `/confirmsignup` | `/crypto` | `/help` | `/home` | `/invest` | `/lock` | `/login` | `/onboarding` | `/settings` | `/signup` | `/transfers`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
