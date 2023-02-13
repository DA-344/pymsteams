"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discloud_app_1 = require("discloud.app");
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
const Command_1 = require("../structures/Command");
class default_1 extends Command_1.default {
    constructor() {
        super({
            noToken: true,
        });
    }
    async run() {
        if (!extension_1.default.workspaceFolder)
            return;
        const workspaceFolder = extension_1.default.workspaceFolder;
        const dConfig = new discloud_app_1.DiscloudConfig(workspaceFolder);
        if (dConfig.exists)
            return;
        dConfig.update({
            ID: "",
            TYPE: "bot",
            MAIN: "",
            NAME: vscode_1.workspace.name,
            AVATAR: "",
            RAM: 100,
            AUTORESTART: false,
            VERSION: "latest",
            APT: "",
        }, [
            "# https://docs.discloudbot.com/discloud.config",
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=create.config.js.map