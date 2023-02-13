"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const path_1 = require("path");
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
                title: (0, l10n_1.t)("progress.commit.title"),
            },
        });
    }
    async run(task, item = {}) {
        if (!extension_1.default.workspaceFolder)
            return;
        const workspaceFolder = extension_1.default.workspaceFolder;
        if (!item.appId) {
            task.progress.report({ message: (0, l10n_1.t)("choose.app") });
            item.appId = await this.pickTeamApp();
            if (!item.appId)
                return;
        }
        task.progress.report({ message: `${item.appId} - ${(0, l10n_1.t)("choose.files")}` });
        const { found } = new util_1.GS(workspaceFolder, "\\.discloudignore", [`${workspaceFolder}/discloud/**`]);
        task.progress.report({
            message: (0, l10n_1.t)("files.zipping"),
            increment: 20,
        });
        const zipName = `${vscode_1.workspace.name}.zip`;
        const savePath = (0, path_1.join)(workspaceFolder, zipName);
        let zipper;
        try {
            zipper = new util_1.Zip(savePath);
            zipper.appendFileList(found, workspaceFolder);
            await zipper.finalize();
        }
        catch (error) {
            zipper?.destroy();
            extension_1.default.resetStatusBar();
            vscode_1.window.showErrorMessage(error);
            return;
        }
        const form = new undici_1.FormData();
        try {
            form.append("file", await (0, discloud_app_1.resolveFile)(savePath, zipName));
        }
        catch (error) {
            zipper.destroy();
            extension_1.default.resetStatusBar();
            vscode_1.window.showErrorMessage(error);
            return;
        }
        task.progress.report({ message: item.appId });
        if (!await this.confirmAction())
            return;
        const res = await (0, util_1.requester)(discloud_app_1.Routes.teamCommit(item.appId), {
            body: form,
            headersTimeout: 420000,
            method: "PUT",
        });
        task.progress.report({ increment: 100 });
        zipper.destroy();
        extension_1.default.resetStatusBar();
        if ("status" in res) {
            if (res.status === "ok") {
                vscode_1.window.showInformationMessage(`${res.status}: ${res.message} - ID: ${item.appId}`);
                await extension_1.default.teamAppTree.getStatus(item.appId);
            }
            else {
                vscode_1.window.showWarningMessage(`${res.status}${res.statusCode ? ` ${res.statusCode}` : ""}: ${res?.message}`);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=commit.js.map