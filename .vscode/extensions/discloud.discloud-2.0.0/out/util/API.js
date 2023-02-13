"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenValidator = exports.requester = void 0;
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const promises_1 = require("node:timers/promises");
const undici_1 = require("undici");
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
const constants_1 = require("./constants");
let { maxUses, uses, time, remain } = {
    maxUses: 60,
    uses: 0,
    time: 60000,
    remain: 60,
};
async function initTimer() {
    await (0, promises_1.setTimeout)(time);
    uses = 0;
}
const processes = [];
async function requester(url, config = {}, isVS) {
    if (!isVS)
        if (processes.length) {
            vscode_1.window.showErrorMessage((0, l10n_1.t)("process.already.running"));
            return false;
        }
        else {
            processes.push(url.toString().split("/").pop());
        }
    if (!remain || maxUses < uses) {
        vscode_1.window.showInformationMessage((0, l10n_1.t)("ratelimited", { s: Math.floor(time / 1000) }));
        extension_1.default.emit("rateLimited", {
            time,
        });
        return false;
    }
    config.throwOnError = true;
    config.headersTimeout = config.headersTimeout ?? 60000;
    config.headers = {
        ...(typeof config.body === "string" ? {
            "Content-Type": "application/json",
        } : {}),
        "api-token": `${extension_1.default.token}`,
        ...(config.headers ?? {}),
        "User-Agent": `vscode/${constants_1.version} (${constants_1.os_name} ${constants_1.os_release}; ${constants_1.os_platform}; ${constants_1.cpu_arch})`,
    };
    uses++;
    try {
        const response = await (0, undici_1.request)(`https://api.discloud.app/v2${url}`, config);
        if (!isVS)
            processes.shift();
        maxUses = parseInt(`${response.headers["ratelimit-limit"]}`);
        time = parseInt(`${response.headers["ratelimit-reset"]}`) * 1000;
        remain = parseInt(`${response.headers["ratelimit-remaining"]}`);
        initTimer();
        if (!remain || maxUses < uses)
            extension_1.default.emit("rateLimited", {
                time,
            });
        return response.body.json();
    }
    catch (error) {
        if (!isVS)
            processes.shift();
        vscode_1.window.showErrorMessage(`${error.body?.message ? error.body.message : error}`);
        return error;
    }
}
exports.requester = requester;
async function tokenValidator(token) {
    try {
        await discloud_app_1.discloud.login(token);
        return true;
    }
    catch {
        return false;
    }
}
exports.tokenValidator = tokenValidator;
//# sourceMappingURL=API.js.map