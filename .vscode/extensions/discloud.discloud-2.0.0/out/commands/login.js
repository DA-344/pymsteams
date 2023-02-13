"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
const Command_1 = require("../structures/Command");
const util_1 = require("../util");
class default_1 extends Command_1.default {
    constructor() {
        super({
            noToken: true,
        });
    }
    async run() {
        const input = await vscode_1.window.showInputBox({
            password: true,
            prompt: (0, l10n_1.t)("input.login.prompt"),
        });
        if (!input)
            return;
        if (!await (0, util_1.tokenValidator)(input)) {
            vscode_1.window.showErrorMessage((0, l10n_1.t)("invalid.token"));
            return false;
        }
        extension_1.default.config.update("token", input, true);
        vscode_1.window.showInformationMessage((0, l10n_1.t)("valid.token"));
    }
}
exports.default = default_1;
//# sourceMappingURL=login.js.map