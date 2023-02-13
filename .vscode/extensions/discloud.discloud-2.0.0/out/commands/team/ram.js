"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const vscode_1 = require("vscode");
const extension_1 = require("../../extension");
const Command_1 = require("../../structures/Command");
const util_1 = require("../../util");
class default_1 extends Command_1.default {
    constructor() {
        super({
            progress: {
                location: vscode_1.ProgressLocation.Notification,
                cancellable: true,
                title: (0, l10n_1.t)("progress.ram.title"),
            },
        });
    }
    async run(task, item = {}) {
        if (!item.appId) {
            task.progress.report({ message: (0, l10n_1.t)("choose.app") });
            item.appId = await this.pickTeamApp();
            if (!item.appId)
                return;
        }
        let ram;
        do {
            ram = await vscode_1.window.showInputBox({
                value: "100",
            });
        } while (typeof ram === "string" ?
            isNaN(Number(ram)) || Number(ram) < 100 :
            false);
        if (!ram)
            return;
        if (!await this.confirmAction())
            return;
        const res = await (0, util_1.requester)(discloud_app_1.Routes.teamLogs(item.appId), {
            body: JSON.stringify({
                ramMB: parseInt(ram),
            }),
            method: "PUT",
        });
        if ("status" in res) {
            vscode_1.window.showWarningMessage(`${res.status}: ${res.message}`);
            if (res.status === "ok")
                await extension_1.default.teamAppTree.getStatus(item.appId);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=ram.js.map