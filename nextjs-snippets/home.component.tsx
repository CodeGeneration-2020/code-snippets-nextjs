import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { getClientConfig } from "../config/client";
import { api } from "../client/api";
import { useAccessStore } from "../store";
import { Path, SlotID } from "../constant";
import styles from "./home.module.scss";
import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";
import { useAppConfig } from "../store/config";
import { getCSSVar, useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "./error";
import { getISOLang, getLang } from "../locales";

const SideBar = dynamic(() => import("./sidebar"), { loading: () => <Loading noLogo /> });
const Chat = dynamic(() => import("./chat"), { loading: () => <Loading noLogo /> });
const NewChat = dynamic(() => import("./new-chat"), { loading: () => <Loading noLogo /> });
const Settings = dynamic(() => import("./settings"), { loading: () => <Loading noLogo /> });
const MaskPage = dynamic(() => import("./mask"), { loading: () => <Loading noLogo /> });

const loadAsyncGoogleFont = () => {
  const linkEl = document.createElement("link");
  const proxyFontUrl = "/google-fonts";
  const remoteFontUrl = "https://fonts.googleapis.com";
  const googleFontUrl =
    getClientConfig()?.buildMode === "export" ? remoteFontUrl : proxyFontUrl;
  linkEl.rel = "stylesheet";
  linkEl.href =
    googleFontUrl +
    "/css2?family=" +
    encodeURIComponent("Noto Sans:wght@300;400;700;900") +
    "&display=swap";
  document.head.appendChild(linkEl);
};

function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light", "dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector('meta[name="theme-color"][media*="dark"]');
    const metaDescriptionLight = document.querySelector('meta[name="theme-color"][media*="light"]');

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--theme-color");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

function useHtmlLang() {
  useEffect(() => {
    const lang = getISOLang();
    const htmlLang = document.documentElement.lang;

    if (lang !== htmlLang) {
      document.documentElement.lang = lang;
    }
  }, []);
}

const Screen = () => {
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isAuth = location.pathname === Path.Auth;
  const isMobileScreen = useMobileScreen();
  const shouldTightBorder = getClientConfig()?.isApp || (config.tightBorder && !isMobileScreen);

  useEffect(() => {
    loadAsyncGoogleFont();
  }, []);

  return (
    <div
      className={`${styles.container} ${shouldTightBorder ? styles["tight-container"] : ""} ${getLang() === "ar" ? styles["rtl-screen"] : ""}`}
    >
      {isAuth ? <AuthPage /> : (
        <>
          <SideBar className={isHome ? styles["sidebar-show"] : ""} />
          <div className={styles["window-content"]} id={SlotID.AppBody}>
            <Routes>
              <Route path={Path.Home} element={<Chat />} />
              <Route path={Path.NewChat} element={<NewChat />} />
              <Route path={Path.Masks} element={<MaskPage />} />
              <Route path={Path.Chat} element={<Chat />} />
              <Route path={Path.Settings} element={<Settings />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

function useLoadData() {
  const config = useAppConfig();

  useEffect(() => {
    (async () => {
      const models = await api.llm.models();
      config.mergeModels(models);
    })();
  }, []);
}

const Home = () => {
  useSwitchTheme();
  useLoadData();
  useHtmlLang();

  useEffect(() => {
    console.log("[Config] got config from build time", getClientConfig());
    useAccessStore.getState().fetch();
  }, []);

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
};

const Loading = (props) => (
  <div className={`${styles["loading-content"]} no-dark`}>
    {!props.noLogo && <BotIcon />}
    <LoadingIcon />
  </div>
);

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export default Home;