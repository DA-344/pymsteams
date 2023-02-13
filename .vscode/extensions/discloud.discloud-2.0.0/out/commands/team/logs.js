"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const vscode_1 = require("vscode");
const Command_1 = require("../../structures/Command");
const util_1 = require("../../util");
class default_1 extends Command_1.default {
    constructor() {
        super({
            progress: {
                location: vscode_1.ProgressLocation.Notification,
                cancellable: true,
                title: (0, l10n_1.t)("progress.logs.title"),
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
        task.progress.report({ message: item.appId });
        const res = await (0, util_1.requester)(discloud_app_1.Routes.teamLogs(item.appId));
        if (!res.apps)
            return;
        const output = vscode_1.window.createOutputChannel(res.apps.id, { log: true });
        output.info(res.apps.terminal.big);
        setTimeout(() => output.show(), 100);
    }
}
exports.default = default_1;
//# sourceMappingURL=logs.js.map