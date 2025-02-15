import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import "./App.scss";
import HeaderMenu from "./components/navbar";
import { MantineEmotionProvider } from "@mantine/emotion";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <MantineProvider theme={theme} withGlobalClasses withCssVariables>
      <MantineEmotionProvider>
        <HeaderMenu></HeaderMenu>
        <Outlet />
      </MantineEmotionProvider>
    </MantineProvider>
  );
}
