import { createContext, useContext } from "react";

export interface RoutingConfig {
  locales: readonly string[];
  defaultLocale: string;
}

const RoutingContext = createContext<RoutingConfig>({
  locales: ["en"],
  defaultLocale: "en",
});

export function RoutingContextProvider({
  value,
  children,
}: {
  value?: RoutingConfig;
  children: React.ReactNode;
}) {
  return (
    <RoutingContext.Provider
      value={
        value || {
          locales: ["en"],
          defaultLocale: "en",
        }
      }
    >
      {children}
    </RoutingContext.Provider>
  );
}

export function useRouting() {
  return useContext(RoutingContext);
}
