"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const node_fs_1 = require("node:fs");
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
                title: (0, l10n_1.t)("progress.upload.title"),
            },
        });
    }
    async run(task) {
        if (!extension_1.default.workspaceFolder)
            return;
        const targetPath = extension_1.default.workspaceFolder;
        if (!await this.confirmAction())
            return;
        extension_1.default.statusBar.setUploading();
        task.progress.report({
            message: (0, l10n_1.t)("files.checking"),
            increment: 10,
        });
        const dConfig = new discloud_app_1.DiscloudConfig(targetPath);
        if (!dConfig.exists || dConfig.missingProps.length) {
            extension_1.default.resetStatusBar();
            vscode_1.window.showErrorMessage((0, l10n_1.t)("invalid.discloud.config"));
            return;
        }
        if (!(0, node_fs_1.existsSync)((0, node_path_1.join)(targetPath, dConfig.data.MAIN))) {
            extension_1.default.resetStatusBar();
            vscode_1.window.showErrorMessage((0, l10n_1.t)("invalid.discloud.config.main", {
                file: dConfig.data.MAIN,
            }) + "\n" + (0, l10n_1.t)("readdiscloudconfigdocs"));
            return;
        }
        ;
        const { found } = new util_1.GS(targetPath, "\\.discloudignore", [`${targetPath}/discloud/**`]);
        if (!found.length) {
            extension_1.default.resetStatusBar();
            vscode_1.window.showErrorMessage((0, l10n_1.t)("files.missing"));
            return;
        }
        if (!(0, util_1.matchOnArray)(found, dConfig.data.MAIN)) {
            extension_1.default.resetStatusBar();
            vscode_1.window.showErrorMessage((0, l10n_1.t)("missing.discloud.config.main", {
                file: dConfig.data.MAIN,
            }) + "\n" + (0, l10n_1.t)("readdiscloudconfigdocs"));
            return;
        }
        task.progress.report({
            message: (0, l10n_1.t)("file.zipping"),
            increment: 20,
        });
        const zipName = `${vscode_1.workspace.name}.zip`;
        const savePath = (0, node_path_1.join)(targetPath, zipName);
        let zipper;
        try {
            zipper = new util_1.Zip(savePath);
            zipper.appendFileList(found, targetPath);
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
            message: (0, l10n_1.t)("uploading"),
            increment: 30,
        });
        const res = await (0, util_1.requester)(discloud_app_1.Routes.upload(), {
            body: form,
            headersTimeout: 420000,
            method: "POST",
        });
        task.progress.report({ increment: 100 });
        zipper.destroy();
        extension_1.default.resetStatusBar();
        if ("status" in res) {
            if (res.status === "ok") {
                if (res.app) {
                    dConfig.update({ ID: res.app.id, AVATAR: res.app.avatarURL });
                    extension_1.default.appTree.addRawApp(res.app);
                    extension_1.default.appTree.getStatus(res.app.id);
                }
                vscode_1.window.showInformationMessage(`${res.status}: ${res.message} - ID: ${res.app?.id}`);
            }
            else {
                vscode_1.window.showWarningMessage(`${res.status}${res.statusCode ? ` ${res.statusCode}` : ""}: ${res.message}`);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=upload.js.map