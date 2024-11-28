/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/screens` | `/screens/home_screen`;
      DynamicRoutes: `/users/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/users/[id]`;
    }
  }
}
