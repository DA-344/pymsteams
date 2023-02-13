"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const vscode_1 = require("vscode");
const util_1 = require("../util");
class Command {
    data;
    constructor(data = {}) {
        this.data = data;
    }
    async pickApp() {
        const res = await (0, util_1.requester)(discloud_app_1.Routes.app("all"));
        if (!res.apps?.length)
            return;
        const apps = res.apps.map(app => `${app.id} - ${app.name} - ${app.online ? (0, l10n_1.t)("online") : (0, l10n_1.t)("offline")}`);
        const picked = await vscode_1.window.showQuickPick(apps, {
            canPickMany: false,
        });
        if (!picked)
            return;
        return picked.split(" - ")[0];
    }
    async pickTeamApp() {
        const res = await (0, util_1.requester)(discloud_app_1.Routes.team());
        if (!res.apps?.length)
            return;
        const apps = res.apps.map(app => `${app.id} - ${app.name} - ${app.online ? "Online" : "Offline"}`);
        const picked = await vscode_1.window.showQuickPick(apps, {
            canPickMany: false,
        });
        if (!picked)
            return;
        return picked.split(" - ")[0];
    }
    async confirmAction(data) {
        data = {
            title: typeof data === "string" ? data : data?.title ?? "common.confirm",
            type: typeof data === "string" ? "showInformationMessage" : data?.type ?? "showInformationMessage",
        };
        const actionOk = (0, l10n_1.t)("action.ok");
        const actionCancel = (0, l10n_1.t)("action.cancel");
        let quickPick;
        if (data.type === "showQuickPick") {
            quickPick = await vscode_1.window.showQuickPick([actionOk, actionCancel], {
                title: (0, l10n_1.t)(data.title),
            });
        }
        else {
            quickPick = await vscode_1.window[data.type]((0, l10n_1.t)(data.title, { action: data.action }), actionOk, actionCancel);
        }
        return quickPick === actionOk;
    }
}
exports.default = Command;
//# sourceMappingURL=Command.js.map