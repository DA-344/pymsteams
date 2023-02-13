"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const vscode_1 = require("vscode");
const Command_1 = require("../../structures/Command");
class default_1 extends Command_1.default {
    constructor() {
        super({
            progress: {
                location: vscode_1.ProgressLocation.Notification,
                cancellable: true,
                title: (0, l10n_1.t)("progress.copy.id.title"),
            },
        });
    }
    async run(task, item = {}) {
        if (!item.appId) {
            task.progress.report({ message: (0, l10n_1.t)("choose.app") });
            item.appId = await this.pickApp();
        }
        if (!item.appId)
            return vscode_1.window.showWarningMessage((0, l10n_1.t)("missing.appid"));
        await vscode_1.env.clipboard.writeText(item.appId);
        vscode_1.window.showInformationMessage((0, l10n_1.t)("copied.appid"));
    }
}
exports.default = default_1;
//# sourceMappingURL=copy.id.js.map