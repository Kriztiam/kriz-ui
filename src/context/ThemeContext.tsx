import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import generateThemeColors from "@/styles/generateThemeColors";

const ThemeContext = createContext<{
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  themeColor: string;
  setThemeColor: React.Dispatch<React.SetStateAction<string>>;
}>({
  theme: "dark",
  setTheme: () => {},
  themeColor: "",
  setThemeColor: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState("dark");
  const [themeColor, setThemeColor] = useState("");

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedThemeColor = localStorage.getItem("themeColor");
    if (savedTheme) setTheme(savedTheme);
    if (savedThemeColor) setThemeColor(savedThemeColor);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (themeColor === "") return;
    const savedThemeColor = localStorage.getItem("themeColor");
    let themeVariables: { name: string; value: string }[] = [];
    if (themeColor === savedThemeColor) {
      const savedThemeVariables = localStorage.getItem("themeVariables");
      if (savedThemeVariables) themeVariables = JSON.parse(savedThemeVariables);
    } else {
      themeVariables = generateThemeColors(themeColor);
      localStorage.setItem("themeColor", themeColor);
      localStorage.setItem("themeVariables", JSON.stringify(themeVariables));
    }
    themeVariables.forEach(({ name, value }) => {
      document.documentElement.style.setProperty(name, value);
    });
  }, [themeColor]);

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        setTheme: setTheme,
        themeColor: themeColor,
        setThemeColor: setThemeColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
