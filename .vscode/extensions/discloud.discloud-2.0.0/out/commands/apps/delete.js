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
                title: (0, l10n_1.t)("progress.delete.title"),
            },
        });
    }
    async run(task, item = {}) {
        if (!item.appId) {
            task.progress.report({ message: (0, l10n_1.t)("choose.app") });
            item.appId = await this.pickApp();
            if (!item.appId)
                return;
        }
        task.progress.report({ message: item.appId });
        if (!await this.confirmAction())
            return;
        const res = await (0, util_1.requester)(discloud_app_1.Routes.appDelete(item.appId), {
            method: "DELETE",
        });
        if ("status" in res) {
            vscode_1.window.showWarningMessage(`${res.status}: ${res.message}`);
            if (res.status === "ok") {
                extension_1.default.appTree.delete(item.appId);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=delete.js.map