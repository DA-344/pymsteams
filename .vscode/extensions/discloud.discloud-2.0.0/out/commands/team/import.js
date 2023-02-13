"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const AdmZip = require("adm-zip");
const discloud_app_1 = require("discloud.app");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const undici_1 = require("undici");
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
                title: (0, l10n_1.t)("progress.import.title"),
            },
        });
    }
    async run(task, item = {}) {
        if (!extension_1.default.workspaceFolder)
            return;
        const workspaceFolder = extension_1.default.workspaceFolder;
        if (!item.appId) {
            task.progress.report({ message: (0, l10n_1.t)("choose.app") });
            item.appId = await this.pickApp();
            if (!item.appId)
                return;
        }
        const res = await (0, util_1.requester)(discloud_app_1.Routes.teamBackup(item.appId));
        if (!res.backups)
            return;
        const backup = await (0, undici_1.fetch)(res.backups.url);
        if (!backup.body)
            return;
        const backupDir = (0, node_path_1.join)(workspaceFolder, "discloud", "backup");
        const backupFolderPath = (0, node_path_1.join)(backupDir, res.backups.id).replace(/\\/g, "/");
        const backupFilePath = `${backupFolderPath}.zip`;
        if (!(0, node_fs_1.existsSync)(backupDir))
            (0, node_fs_1.mkdirSync)(backupDir, { recursive: true });
        await (0, promises_1.writeFile)(backupFilePath, backup.body, "utf8");
        new AdmZip(backupFilePath).extractAllTo((0, node_path_1.join)(backupDir, res.backups.id));
        (0, node_fs_1.unlinkSync)(backupFilePath);
        const actionOk = (0, l10n_1.t)("open.dir");
        const action = await vscode_1.window.showInformationMessage((0, l10n_1.t)("import.success"), actionOk);
        if (action === actionOk)
            vscode_1.commands.executeCommand("vscode.openFolder", vscode_1.Uri.file(backupFolderPath));
    }
}
exports.default = default_1;
//# sourceMappingURL=import.js.map