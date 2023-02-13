"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const vscode_1 = require("vscode");
const extension_1 = require("../../extension");
const Command_1 = require("../../structures/Command");
class default_1 extends Command_1.default {
    constructor() {
        super({
            progress: {
                location: vscode_1.ProgressLocation.Notification,
                cancellable: true,
                title: (0, l10n_1.t)("progress.status.title"),
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
        item = extension_1.default.appTree.children.get(item.appId);
        if (!item?.appId)
            return;
        if (!item.children.size)
            return extension_1.default.appTree.fetch();
        await extension_1.default.appTree.getStatus(item.appId);
    }
}
exports.default = default_1;
//# sourceMappingURL=status.js.map