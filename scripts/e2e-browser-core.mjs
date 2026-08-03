import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const baseUrl = process.env.MBN_E2E_URL || "http://127.0.0.1:5174";
const login = process.env.MBN_E2E_LOGIN || "";
const password = process.env.MBN_E2E_PASSWORD || "";
const port = Number(process.env.MBN_E2E_DEBUG_PORT || 9333);
const timeoutMs = Number(process.env.MBN_E2E_TIMEOUT_MS || 15000);

const chromeCandidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
].filter(Boolean);

const commandExists = (command) => {
    if (command.includes("/")) return fs.existsSync(command);
    try {
        execFileSync("sh", ["-lc", `command -v ${JSON.stringify(command)}`], {
            stdio: "ignore",
        });
        return true;
    } catch {
        return false;
    }
};

const chrome = chromeCandidates.find(commandExists);
if (!chrome) {
    console.error("Không tìm thấy Chrome/Chromium. Thiết lập CHROME_BIN.");
    process.exit(2);
}
if (!login || !password) {
    console.error("Thiết lập MBN_E2E_LOGIN và MBN_E2E_PASSWORD cho tài khoản kiểm thử.");
    process.exit(2);
}

const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "mbn-browser-e2e-"));
const browser = spawn(chrome, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitUntil = async (probe, label, timeout = timeoutMs) => {
    const started = Date.now();
    while (Date.now() - started < timeout) {
        try {
            const value = await probe();
            if (value) return value;
        } catch {}
        await sleep(150);
    }
    throw new Error(`Timeout: ${label}`);
};

const json = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.json();
};

let socket;
const pending = new Map();
let messageId = 0;
const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
        const id = ++messageId;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
    });

const evaluate = async (expression, awaitPromise = true) => {
    const result = await send("Runtime.evaluate", {
        expression,
        awaitPromise,
        returnByValue: true,
        userGesture: true,
    });
    if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
    }
    return result.result?.value;
};

const navigate = async (route) => {
    await send("Page.navigate", { url: new URL(route, baseUrl).href });
    await waitUntil(
        () => evaluate('document.readyState === "complete"'),
        `load ${route}`,
    );
    await waitUntil(
        () => evaluate('Boolean(document.querySelector("#root"))'),
        `root ${route}`,
    );
};

const assertText = async (text, label = text) => {
    await waitUntil(
        () => evaluate(`document.body?.innerText?.includes(${JSON.stringify(text)})`),
        label,
    );
};

const clickText = async (text) => {
    const clicked = await evaluate(`(() => {
        const candidate = [...document.querySelectorAll("button,a")].find(
            (element) => element.textContent?.trim().includes(${JSON.stringify(text)})
        );
        if (!candidate) return false;
        candidate.click();
        return true;
    })()`);
    if (!clicked) throw new Error(`Không tìm thấy action: ${text}`);
};

try {
    await waitUntil(
        () => json(`http://127.0.0.1:${port}/json/version`).catch(() => null),
        "Chrome DevTools",
    );
    const target = await json(
        `http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`,
        { method: "PUT" },
    );
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        socket.addEventListener("open", resolve, { once: true });
        socket.addEventListener("error", reject, { once: true });
    });
    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (!message.id || !pending.has(message.id)) return;
        const handler = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) handler.reject(new Error(message.error.message));
        else handler.resolve(message.result);
    });

    await send("Page.enable");
    await send("Runtime.enable");
    await send("DOM.enable");
    await navigate("/");

    await evaluate('window.dispatchEvent(new CustomEvent("mbn:open-auth", { detail: { mode: "login" } }))');
    await assertText("ĐĂNG NHẬP TÀI KHOẢN", "login modal");
    await evaluate(`(() => {
        const username = document.querySelector('input[autocomplete="username"]');
        const passwordInput = document.querySelector('input[autocomplete="current-password"]');
        const set = (element, value) => {
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
            setter.call(element, value);
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.dispatchEvent(new Event("change", { bubbles: true }));
        };
        if (!username || !passwordInput) return false;
        set(username, ${JSON.stringify(login)});
        set(passwordInput, ${JSON.stringify(password)});
        const form = username.closest("form");
        form?.requestSubmit();
        return true;
    })()`);
    await waitUntil(
        () => evaluate('!document.body?.innerText?.includes("ĐĂNG NHẬP TÀI KHOẢN")'),
        "login success",
        timeoutMs * 2,
    );
    console.log("PASS login");

    const routeChecks = [
        ["/account/profile", "Hồ sơ"],
        ["/account/products/new", "Đăng sản phẩm"],
        ["/account/purchases", "giao dịch"],
        ["/account/wallet/transactions", "ví"],
        ["/account/payouts", "Nhận tiền và rút tiền"],
        ["/account/documents", "tài liệu"],
    ];
    for (const [route, text] of routeChecks) {
        await navigate(route);
        await assertText(text, route);
        console.log(`PASS ${route}`);
    }

    const offerChecks = [
        [process.env.MBN_E2E_PURCHASE_PATH, "Mua ngay"],
        [process.env.MBN_E2E_RENTAL_PATH, "Thuê ngay"],
        [process.env.MBN_E2E_INSTALLMENT_PATH, "Mua trả góp"],
    ].filter(([route]) => route);
    for (const [route, action] of offerChecks) {
        await navigate(route);
        await assertText(action, `${route} action`);
        await clickText(action);
        await assertText("Thanh toán", `${route} payment modal`);
        await evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))`);
        console.log(`PASS offer ${action}`);
    }

    if (process.env.MBN_E2E_TRANSACTION_ID) {
        await navigate(`/account/purchases/${process.env.MBN_E2E_TRANSACTION_ID}`);
        for (const text of ["Tổng phải thanh toán", "Tiến trình giao dịch", "Hồ sơ tài liệu"]) {
            await assertText(text, `transaction detail ${text}`);
        }
        console.log("PASS transaction detail");
    }

    if (process.env.MBN_E2E_AVATAR_PATH) {
        await navigate("/account/profile");
        const documentNode = await send("DOM.getDocument", { depth: -1 });
        const inputNode = await send("DOM.querySelector", {
            nodeId: documentNode.root.nodeId,
            selector: 'input[type="file"]',
        });
        if (!inputNode.nodeId) throw new Error("Không tìm thấy avatar file input.");
        await send("DOM.setFileInputFiles", {
            nodeId: inputNode.nodeId,
            files: [path.resolve(process.env.MBN_E2E_AVATAR_PATH)],
        });
        await sleep(1000);
        console.log("PASS avatar file selection");
    }

    await clickText("Đăng xuất");
    await waitUntil(
        () => evaluate('document.body?.innerText?.includes("Đăng nhập")'),
        "logout",
    );
    console.log("PASS logout");
    console.log("Browser core flow PASS");
} finally {
    try { socket?.close(); } catch {}
    browser.kill("SIGTERM");
    fs.rmSync(profileDir, { recursive: true, force: true });
}
