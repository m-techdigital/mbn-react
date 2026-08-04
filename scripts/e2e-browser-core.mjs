import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const baseUrl = process.env.MBN_E2E_URL || "http://127.0.0.1:5174";
const login = process.env.MBN_E2E_LOGIN || "";
const password = process.env.MBN_E2E_PASSWORD || "";
const port = Number(process.env.MBN_E2E_DEBUG_PORT || 9333);
const timeoutMs = Number(process.env.MBN_E2E_TIMEOUT_MS || 15000);
const defaultAvatarPath = path.resolve("tests/fixtures/avatar-e2e.png");
const avatarPath = process.env.MBN_E2E_AVATAR_PATH || (fs.existsSync(defaultAvatarPath) ? defaultAvatarPath : "");

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
const waitForBrowserExit = () =>
    new Promise((resolve) => {
        if (browser.exitCode !== null || browser.signalCode) {
            resolve();
            return;
        }
        browser.once("exit", resolve);
        browser.once("error", resolve);
        browser.kill("SIGTERM");
        setTimeout(resolve, 3000);
    });
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
const networkResponses = [];
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


const setViewport = async (width, height, mobile = false) => {
    await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile,
    });
};

const assertNoHorizontalOverflow = async (label) => {
    const metrics = await evaluate(`(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body?.scrollWidth || 0
    }))()`);
    if (Math.max(metrics.scrollWidth, metrics.bodyScrollWidth) > metrics.width + 4) {
        throw new Error(`${label} bị tràn ngang: ${JSON.stringify(metrics)}`);
    }
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

const openLoginModal = async () => {
    await evaluate('window.dispatchEvent(new CustomEvent("mbn:open-auth", { detail: { mode: "login" } }))');
    const openedByEvent = await waitUntil(
        () => evaluate('document.body?.innerText?.includes("ĐĂNG NHẬP TÀI KHOẢN")').catch(() => false),
        "login modal event",
        2500,
    ).catch(() => false);
    if (openedByEvent) return;
    await navigate("/account/profile");
    const openedByRouteGuard = await waitUntil(
        () => evaluate('document.body?.innerText?.includes("ĐĂNG NHẬP TÀI KHOẢN")').catch(() => false),
        "login modal protected route",
        timeoutMs,
    ).catch(() => false);
    if (openedByRouteGuard) return;
    const bodyText = await evaluate("document.body?.innerText?.slice(0, 1000) || ''");
    throw new Error(`Không mở được modal đăng nhập. Body hiện tại: ${bodyText}`);
};

const submitLoginForm = async () => {
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
        username.closest("form")?.requestSubmit();
        return true;
    })()`);
};

const waitForLoginSuccess = async (label) => {
    const succeeded = await waitUntil(
        () => evaluate('!document.body?.innerText?.includes("ĐĂNG NHẬP TÀI KHOẢN")'),
        label,
        timeoutMs * 2,
    ).catch(() => false);
    if (succeeded) return;

    const bodyText = await evaluate("document.body?.innerText?.slice(0, 1000) || ''");
    if (bodyText.includes("Too Many Attempts")) {
        console.log("WAIT auth throttle window");
        await sleep(65000);
        await submitLoginForm();
        const retrySucceeded = await waitUntil(
            () => evaluate('!document.body?.innerText?.includes("ĐĂNG NHẬP TÀI KHOẢN")'),
            `${label} retry`,
            timeoutMs * 2,
        ).catch(() => false);
        if (retrySucceeded) return;
    }

    const latestBodyText = await evaluate("document.body?.innerText?.slice(0, 1000) || ''");
    throw new Error(`Đăng nhập không thành công. Body hiện tại: ${latestBodyText}`);
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
        if (message.method === "Network.responseReceived") {
            networkResponses.push({
                url: message.params?.response?.url || "",
                status: message.params?.response?.status || 0,
                mimeType: message.params?.response?.mimeType || "",
            });
            if (networkResponses.length > 100) networkResponses.shift();
        }
        if (!message.id || !pending.has(message.id)) return;
        const handler = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) handler.reject(new Error(message.error.message));
        else handler.resolve(message.result);
    });

    await send("Page.enable");
    await send("Network.enable");
    await send("Runtime.enable");
    await send("DOM.enable");
    await navigate("/");

    await openLoginModal();
    await assertText("ĐĂNG NHẬP TÀI KHOẢN", "login modal");
    await submitLoginForm();
    await waitForLoginSuccess("login success");
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
        [process.env.MBN_E2E_PURCHASE_PATH || "/teamobi/ninja-school/NSO-0102", "Mua ngay", ["Thuê ngay"]],
        [process.env.MBN_E2E_RENTAL_PATH || "/teamobi/ninja-school/NSO-0201", "Thuê ngay", ["Mua trả góp"]],
        [process.env.MBN_E2E_INSTALLMENT_PATH || "/teamobi/ngoc-rong/NRO-0301", "Mua trả góp", ["Thuê ngay"]],
    ];
    const responsiveChecks = [
        { name: "desktop", width: 1440, height: 1000, mobile: false },
        { name: "tablet", width: 834, height: 1112, mobile: true },
        { name: "mobile", width: 390, height: 844, mobile: true },
    ];
    for (const viewport of responsiveChecks) {
        await setViewport(viewport.width, viewport.height, viewport.mobile);
        for (const route of [
            process.env.MBN_E2E_PURCHASE_PATH || "/teamobi/ninja-school/NSO-0102",
            "/account/purchases",
            "/account/profile",
        ]) {
            await navigate(route);
            await assertNoHorizontalOverflow(`${viewport.name} ${route}`);
        }
        console.log(`PASS responsive layout ${viewport.name}`);
    }
    await setViewport(1440, 1000, false);

    for (const [route, action, forbiddenActions] of offerChecks) {
        await navigate(route);
        await assertText(action, `${route} action`);
        for (const forbidden of forbiddenActions) {
            const visible = await evaluate(`document.body?.innerText?.includes(${JSON.stringify(forbidden)})`);
            if (visible) throw new Error(`${route} hiển thị action không hợp lệ: ${forbidden}`);
        }
        await clickText(action);
        await assertText("Thanh toán", `${route} payment modal`);
        await waitUntil(
            () => evaluate('Boolean([...document.querySelectorAll("body *")].find((node) => /Tổng|Cần thanh toán|Thanh toán ban đầu/.test(node.textContent || "")))'),
            `${route} payment amount`,
        );
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

    let uploadedAvatarSrc = "";
    if (avatarPath) {
        await navigate("/account/profile");
        await assertText("Ảnh đại diện", "profile avatar field");
        const inputNodeId = await waitUntil(async () => {
            const documentNode = await send("DOM.getDocument", { depth: -1 });
            const inputNode = await send("DOM.querySelector", {
                nodeId: documentNode.root.nodeId,
                selector: 'input[type="file"]',
            });
            return inputNode.nodeId || 0;
        }, "avatar file input");
        await send("DOM.setFileInputFiles", {
            nodeId: inputNodeId,
            files: [path.resolve(avatarPath)],
        });
        await evaluate(`(() => {
            const input = document.querySelector('input[type="file"]');
            if (!input) return false;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
        })()`);
        await assertText("Đã cập nhật ảnh đại diện", "avatar upload success").catch((error) => {
            const avatarResponse = [...networkResponses].reverse().find((entry) =>
                entry.url.includes("/customer/profile/avatar")
            );
            throw new Error(
                `${error.message}. Avatar response: ${JSON.stringify(avatarResponse || null)}`,
            );
        });
        const avatarBeforeReload = await evaluate('document.querySelector(".mbn-profile-summary__avatar img")?.getAttribute("src") || ""');
        if (!avatarBeforeReload || !avatarBeforeReload.includes("/storage/")) {
            throw new Error("Avatar không hiển thị bằng ảnh đã upload.");
        }
        await navigate("/account/profile");
        const avatarAfterReload = await waitUntil(
            () => evaluate('document.querySelector(".mbn-profile-summary__avatar img")?.getAttribute("src") || ""').then((value) => value && value.includes("/storage/") ? value : ""),
            "avatar hydrate after reload",
            timeoutMs,
        );
        const sameAvatar = await evaluate(`(() => {
            const normalize = (value) => { try { const url = new URL(value, location.origin); return url.pathname; } catch { return value; } };
            return normalize(${JSON.stringify(avatarBeforeReload)}) === normalize(${JSON.stringify(avatarAfterReload)});
        })()`);
        if (!avatarAfterReload || !sameAvatar) {
            throw new Error("Avatar bị mất hoặc thay đổi sau khi tải lại trang.");
        }
        uploadedAvatarSrc = avatarAfterReload;
        console.log("PASS avatar upload persistence");
    }

    await navigate("/account/profile");
    await clickText("Đăng xuất");
    await waitUntil(
        () => evaluate('document.body?.innerText?.includes("Đăng nhập")'),
        "logout",
    );
    console.log("PASS logout");

    if (uploadedAvatarSrc) {
        await navigate("/");
        await openLoginModal();
        await assertText("ĐĂNG NHẬP TÀI KHOẢN", "re-login modal");
        await submitLoginForm();
        await waitForLoginSuccess("re-login success");
        await navigate("/account/profile");
        const avatarAfterRelogin = await waitUntil(
            () => evaluate('document.querySelector(".mbn-profile-summary__avatar img")?.getAttribute("src") || ""').then((value) => value && value.includes("/storage/") ? value : ""),
            "avatar hydrate after re-login",
            timeoutMs,
        );
        const sameAvatarAfterRelogin = await evaluate(`(() => {
            const normalize = (value) => { try { const url = new URL(value, location.origin); return url.pathname; } catch { return value; } };
            return normalize(${JSON.stringify(uploadedAvatarSrc)}) === normalize(${JSON.stringify(avatarAfterRelogin)});
        })()`);
        if (!avatarAfterRelogin || !sameAvatarAfterRelogin) {
            throw new Error("Avatar bị mất hoặc thay đổi sau logout/login lại.");
        }
        console.log("PASS avatar persistence after re-login");
        await clickText("Đăng xuất");
    }
    console.log("Browser core flow PASS");
} finally {
    try { socket?.close(); } catch {}
    await waitForBrowserExit();
    fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
