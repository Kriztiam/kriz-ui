import Link from "next/link";
import {
  usePathname as nextUsePathname,
  useRouter as nextUseRouter,
} from "next/navigation";
import { createContext, useContext } from "react";

type Query = Record<
  string,
  string | number | boolean | string[] | number[] | boolean[]
>;

type Href = string | { pathname: string; query?: Query };

type NextRouter = ReturnType<typeof nextUseRouter>;
interface NextIntlRouter {
  push: (
    href: Href,
    options?: Partial<{ scroll: boolean; locale?: string }>
  ) => void;
  replace: (
    href: Href,
    options?: Partial<{ scroll: boolean; locale?: string }>
  ) => void;
  prefetch?: (href: Href, options?: Partial<{ locale?: string }>) => void;
  back: () => void;
}

export interface NavigationContextValue {
  Link: React.ElementType;
  usePathname: () => ReturnType<typeof nextUsePathname>;
  useRouter: () => NextRouter | NextIntlRouter;
}

const NavigationContext = createContext<NavigationContextValue>({
  Link,
  usePathname: nextUsePathname,
  useRouter: nextUseRouter,
});

export function NavigationContextProvider({
  value,
  children,
}: {
  value?: NavigationContextValue;
  children: React.ReactNode;
}) {
  return (
    <NavigationContext.Provider
      value={
        value || {
          Link,
          usePathname: nextUsePathname,
          useRouter: nextUseRouter,
        }
      }
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  return {
    Link: ctx.Link,
    pathname: ctx.usePathname(),
    router: ctx.useRouter(),
  };
}
