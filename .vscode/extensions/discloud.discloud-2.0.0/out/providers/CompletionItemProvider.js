"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discloud_app_1 = require("discloud.app");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const vscode_1 = require("vscode");
const DiscloudConfigScopes = [
    "ID",
    "TYPE",
    "MAIN",
    "NAME",
    "AVATAR",
    "RAM",
    "VERSION",
    "AUTORESTART",
    "APT",
];
class CompletionItemProvider {
    disposable;
    constructor() {
        this.disposable = vscode_1.languages.registerCompletionItemProvider("discloud.config", {
            provideCompletionItems(document, position, token, context) {
                if (!position.character)
                    return DiscloudConfigScopes.map(scope => new vscode_1.CompletionItem(`${scope}=`, vscode_1.CompletionItemKind.Value))
                        .concat(new vscode_1.CompletionItem("# https://docs.discloudbot.com/discloud.config", vscode_1.CompletionItemKind.Reference));
                const textLine = document.lineAt(position);
                const text = textLine.text.substring(0, position.character);
                const splitted = text.split("=");
                if (splitted.length === 1) {
                    if (DiscloudConfigScopes.includes(splitted[0]))
                        return [new vscode_1.CompletionItem(`${splitted[0]}=`, vscode_1.CompletionItemKind.Value)];
                    return DiscloudConfigScopes
                        .filter(scope => scope.includes(splitted[0]))
                        .map(scope => new vscode_1.CompletionItem(`${scope}=`, vscode_1.CompletionItemKind.Value));
                }
                return CompletionItemProvider[splitted[0]]?.(splitted[1], document);
            },
        });
    }
    static APT(text) {
        const pkgs = text.split(",");
        return discloud_app_1.APTPackages
            .filter(pkg => !pkgs.includes(pkg))
            .map(pkg => new vscode_1.CompletionItem({
            label: pkg,
            description: discloud_app_1.APT[pkg].join(", "),
        }, vscode_1.CompletionItemKind.Value));
    }
    static AUTORESTART() {
        return [
            new vscode_1.CompletionItem("false", vscode_1.CompletionItemKind.Keyword),
            new vscode_1.CompletionItem("true", vscode_1.CompletionItemKind.Keyword),
        ];
    }
    static MAIN(text, document) {
        let targetPath = (0, node_path_1.join)((0, node_path_1.dirname)(document.uri.fsPath), text);
        while (targetPath && !(0, node_fs_1.existsSync)(targetPath)) {
            targetPath = (0, node_path_1.dirname)(targetPath);
        }
        if (!targetPath)
            return;
        const files = (0, node_fs_1.readdirSync)(targetPath, { withFileTypes: true });
        return files.map(file => new vscode_1.CompletionItem(file.name, file.isFile() ? vscode_1.CompletionItemKind.File : vscode_1.CompletionItemKind.Folder));
    }
    static RAM(text, document) {
        const value = this.getText(document, /^TYPE=/);
        switch (value) {
            case "bot":
                return [new vscode_1.CompletionItem("100", vscode_1.CompletionItemKind.Unit)];
            case "site":
                return [new vscode_1.CompletionItem("512", vscode_1.CompletionItemKind.Unit)];
            default:
                return [
                    new vscode_1.CompletionItem("100", vscode_1.CompletionItemKind.Unit),
                    new vscode_1.CompletionItem("512", vscode_1.CompletionItemKind.Unit),
                ];
        }
    }
    static TYPE() {
        return [
            new vscode_1.CompletionItem("bot", vscode_1.CompletionItemKind.Constant),
            new vscode_1.CompletionItem("site", vscode_1.CompletionItemKind.Constant),
        ];
    }
    static VERSION() {
        return [
            new vscode_1.CompletionItem("latest", vscode_1.CompletionItemKind.Constant),
            new vscode_1.CompletionItem("current", vscode_1.CompletionItemKind.Constant),
            new vscode_1.CompletionItem("suja", vscode_1.CompletionItemKind.Constant),
        ];
    }
    static getText(document, pattern) {
        pattern = RegExp(pattern);
        for (let i = 0; i < document.lineCount; i++) {
            const lineText = document.lineAt(i);
            if (pattern.test(lineText.text))
                return lineText.text.split("=")[1];
        }
    }
}
exports.default = CompletionItemProvider;
//# sourceMappingURL=CompletionItemProvider.js.map