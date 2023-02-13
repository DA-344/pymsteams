"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const fs_1 = require("fs");
const node_path_1 = require("node:path");
const undici_1 = require("undici");
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
const Command_1 = require("../structures/Command");
const util_1 = require("../util");
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
    async run(task) {
        if (!extension_1.default.workspaceFolder)
            return;
        const workspaceFolder = extension_1.default.workspaceFolder;
        const paths = await extension_1.default.copyFilePath();
        if (!await this.confirmAction())
            return;
        extension_1.default.statusBar.setCommiting();
        task.progress.report({ message: (0, l10n_1.t)("choose.app") });
        const appId = await this.pickApp();
        if (!appId)
            return;
        task.progress.report({
            message: (0, l10n_1.t)("files.checking"),
            increment: 10,
        });
        const { list } = new discloud_app_1.IgnoreFiles({
            fileName: ".discloudignore",
            path: workspaceFolder,
            optionalIgnoreList: [`${workspaceFolder}/discloud/**`],
        });
        let files = [];
        for (const path of paths) {
            if ((0, fs_1.existsSync)(path))
                if ((0, fs_1.statSync)(path).isFile()) {
                    files.push(path);
                }
                else {
                    const { found } = new util_1.GS(path, "", list);
                    files.push(found);
                }
        }
        files = [...new Set(files.flat())];
        task.progress.report({
            message: (0, l10n_1.t)("file.zipping"),
            increment: 20,
        });
        const zipName = `${vscode_1.workspace.name}.zip`;
        const savePath = (0, node_path_1.join)(workspaceFolder, zipName);
        let zipper;
        try {
            zipper = new util_1.Zip(savePath);
            zipper.appendFileList(files, workspaceFolder);
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
        task.progress.report({
            message: (0, l10n_1.t)("commiting"),
            increment: 30,
        });
        const data = await (0, util_1.requester)(discloud_app_1.Routes.appCommit(appId), {
            body: form,
            headersTimeout: 420000,
            method: "PUT",
        });
        task.progress.report({ increment: 100 });
        zipper.destroy();
        extension_1.default.resetStatusBar();
        if ("status" in data) {
            if (data.status === "ok") {
                vscode_1.window.showInformationMessage(`${data.status}: ${data.message} - ID: ${appId}`);
                await extension_1.default.appTree.getStatus(appId);
            }
            else {
                vscode_1.window.showWarningMessage(`${data.status}${data.statusCode ? ` ${data.statusCode}` : ""}: ${data?.message}`);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=commit.js.map