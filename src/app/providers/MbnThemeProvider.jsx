import ConfigProvider from "antd/es/config-provider";
import theme from "antd/es/theme";

const mbnTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: "#bd00ff",
        colorInfo: "#bd00ff",
        colorBgBase: "#08050d",
        colorBgContainer: "#111113",
        colorBgElevated: "#17171a",
        colorBorder: "#6d1a80",
        colorBorderSecondary: "#343036",
        colorText: "#f7f0ff",
        colorTextSecondary: "#bcaec8",
        colorSuccess: "#41d18a",
        colorWarning: "#f2b84b",
        colorError: "#ff5d7a",
        borderRadius: 3,
        borderRadiusLG: 4,
    },
    components: {
        Button: { primaryShadow: "0 0 18px rgba(189, 0, 255, 0.32)" },
        Layout: { bodyBg: "#08050d", headerBg: "#100917", siderBg: "#100917" },
        Modal: { contentBg: "#171020", headerBg: "#21142d" },
        Drawer: { colorBgElevated: "#171020" },
        Table: { headerBg: "#21142d", headerColor: "#f7f0ff", rowHoverBg: "#2a1838" },
    },
};

export default function MbnThemeProvider({ children }) {
    return <ConfigProvider theme={mbnTheme}>{children}</ConfigProvider>;
}
