import {
  NavigationContextProvider,
  NavigationContextValue,
} from "./NavigationContext";
import { RoutingConfig, RoutingContextProvider } from "./RoutingContext";
import { ThemeContextProvider } from "./ThemeContext";

export default function KrizUIContextProvider({
  navigation,
  routing,
  children,
}: {
  navigation?: NavigationContextValue;
  routing?: RoutingConfig;
  children: React.ReactNode;
}) {
  return (
    <NavigationContextProvider value={navigation}>
      <RoutingContextProvider value={routing}>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </RoutingContextProvider>
    </NavigationContextProvider>
  );
}
