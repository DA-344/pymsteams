"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
class DiagnosticProvider {
    collection = vscode_1.languages.createDiagnosticCollection("discloud.config");
    diagnostics = [];
    disposableDocuments = [];
    constructor() {
        if (vscode_1.window.activeTextEditor?.document.languageId === "discloud.config") {
            this.check(vscode_1.window.activeTextEditor.document);
            this.activate();
        }
        const disposableEditor = vscode_1.window.onDidChangeActiveTextEditor(editor => {
            if (editor?.document.languageId === "discloud.config") {
                this.check(editor.document);
                this.activate();
            }
            else {
                this.deactivate();
                this.collection.clear();
            }
        });
        extension_1.default.context.subscriptions.push(disposableEditor);
    }
    activate() {
        const disposable = vscode_1.workspace.onDidChangeTextDocument((event) => {
            if (event.document.languageId === "discloud.config")
                for (const _ of event.contentChanges) {
                    this.check(event.document);
                }
        });
        extension_1.default.context.subscriptions.push(disposable);
        this.disposableDocuments.push(disposable);
    }
    deactivate() {
        for (let i = 0; i < this.disposableDocuments.length;) {
            this.disposableDocuments.shift()?.dispose();
        }
    }
    check(document) {
        this.diagnostics = [];
        const scopes = {};
        let type;
        for (let i = 0; i < document.lineCount; i++) {
            const textLine = document.lineAt(i);
            if (!textLine.text)
                continue;
            if (textLine.text.startsWith("#"))
                continue;
            const [key, value] = textLine.text.split("=");
            scopes[key] = value;
            if (/\s/g.test(key))
                this.diagnostics.push({
                    message: (0, l10n_1.t)("diagnostic.no.spaces"),
                    range: new vscode_1.Range(new vscode_1.Position(i, 0), new vscode_1.Position(i, key.length)),
                    severity: vscode_1.DiagnosticSeverity.Error,
                });
            if (DiscloudConfigScopes.includes(key)) {
                if (!textLine.text.includes("="))
                    this.diagnostics.push({
                        message: (0, l10n_1.t)("diagnostic.equal.missing"),
                        range: new vscode_1.Range(new vscode_1.Position(i, key.length), new vscode_1.Position(i, textLine.text.length)),
                        severity: vscode_1.DiagnosticSeverity.Error,
                    });
                if (/(^\s|\s$)/.test(value))
                    this.diagnostics.push({
                        message: (0, l10n_1.t)("diagnostic.no.spaces"),
                        range: new vscode_1.Range(new vscode_1.Position(i, key.length + 1), new vscode_1.Position(i, textLine.text.length)),
                        severity: vscode_1.DiagnosticSeverity.Error,
                    });
                if (key === "TYPE") {
                    type = DiagnosticProvider.TYPE({
                        diagnostics: this.diagnostics,
                        document,
                        line: i,
                        text: value,
                        end: textLine.text.length,
                        start: key.length + 1,
                    });
                }
                else {
                    DiagnosticProvider[key]?.({
                        diagnostics: this.diagnostics,
                        document,
                        line: i,
                        text: value,
                        end: textLine.text.length,
                        start: key.length + 1,
                    });
                }
            }
            else {
                this.diagnostics.push({
                    message: (0, l10n_1.t)("diagnostic.wrong"),
                    range: new vscode_1.Range(new vscode_1.Position(i, 0), new vscode_1.Position(i, key.length)),
                    severity: vscode_1.DiagnosticSeverity.Error,
                });
            }
        }
        const missingScopes = requiredScopes[type ?? "common"]
            .filter((scope) => !scopes[scope]);
        if (missingScopes.length) {
            this.diagnostics.push({
                message: (0, l10n_1.t)("diagnostic.scopes.missing", {
                    scopes: `[${missingScopes.join(", ")}]`,
                }),
                range: new vscode_1.Range(new vscode_1.Position(0, 0), new vscode_1.Position(document.lineCount, 0)),
                severity: vscode_1.DiagnosticSeverity.Error,
            });
        }
        this.updateDiagnostics(document);
    }
    updateDiagnostics(document) {
        this.collection.set(document.uri, this.diagnostics);
    }
    static APT(data) {
        if (!data.text)
            return;
        let aptslength = 0;
        const apts = data.text.split(/,\s?/g);
        for (const apt of apts) {
            if (!discloud_app_1.APTPackages.includes(apt))
                data.diagnostics.push({
                    message: (0, l10n_1.t)("diagnostic.apt.invalid"),
                    range: new vscode_1.Range(new vscode_1.Position(data.line, aptslength + (data.start ?? 0)), new vscode_1.Position(data.line, aptslength + (data.end ?? data.start ?? 0))),
                    severity: vscode_1.DiagnosticSeverity.Error,
                });
            aptslength += apt.length + 1;
        }
    }
    static AUTORESTART(data) {
        if (!data.text)
            return;
        if (!["true", "false"].includes(data.text))
            data.diagnostics.push({
                message: (0, l10n_1.t)("diagnostic.must.be.boolean"),
                range: new vscode_1.Range(new vscode_1.Position(data.line, data.start ?? 0), new vscode_1.Position(data.line, data.end ?? data.start ?? 0)),
                severity: vscode_1.DiagnosticSeverity.Error,
            });
    }
    static AVATAR(data) {
        if (!data.text)
            return;
        if (!/(https?:\/\/).+\.(png)/.test(data.text)) {
            data.diagnostics.push({
                message: (0, l10n_1.t)("diagnostic.avatar.must.be.url"),
                range: new vscode_1.Range(new vscode_1.Position(data.line, data.start ?? 0), new vscode_1.Position(data.line, data.end ?? data.start ?? 0)),
                severity: vscode_1.DiagnosticSeverity.Error,
            });
        }
    }
    static MAIN(data) {
        if (!data.text)
            return;
        if (!extension_1.default.workspaceFolder)
            return;
        if (!(0, node_fs_1.existsSync)((0, node_path_1.join)(extension_1.default.workspaceFolder, data.text)))
            data.diagnostics.push({
                message: (0, l10n_1.t)("diagnostic.main.not.exist"),
                range: new vscode_1.Range(new vscode_1.Position(data.line, data.start ?? 0), new vscode_1.Position(data.line, data.end ?? data.start ?? 0)),
                severity: vscode_1.DiagnosticSeverity.Error,
            });
    }
    static RAM(data) {
        if (!data.text)
            return;
        if (isNaN(Number(data.text))) {
            data.diagnostics.push({
                message: (0, l10n_1.t)("diagnostic.ram.must.be.number"),
                range: new vscode_1.Range(new vscode_1.Position(data.line, data.start ?? 0), new vscode_1.Position(data.line, data.end ?? data.start ?? 0)),
                severity: vscode_1.DiagnosticSeverity.Error,
            });
        }
        else {
            const type = this.getText(data.document, /^TYPE=/);
            const min = type === "site" ? 512 : 100;
            if (Number(data.text) < min)
                data.diagnostics.push({
                    message: (0, l10n_1.t)("diagnostic.ram.must.be.higher", {
                        min,
                    }),
                    range: new vscode_1.Range(new vscode_1.Position(data.line, data.start ?? 0), new vscode_1.Position(data.line, data.end ?? data.start ?? 0)),
                    severity: vscode_1.DiagnosticSeverity.Error,
                });
        }
    }
    static TYPE(data) {
        if (data.text === "bot")
            return "bot";
        if (data.text === "site")
            return "site";
        data.diagnostics.push({
            message: (0, l10n_1.t)("diagnostic.type.must.be"),
            range: new vscode_1.Range(new vscode_1.Position(data.line, data.start ?? 0), new vscode_1.Position(data.line, data.end ?? data.start ?? 0)),
            severity: vscode_1.DiagnosticSeverity.Error,
        });
        return "common";
    }
    static VERSION(data) {
        if (!data.text)
            return;
        if (!/^(latest|current|suja|(?:\d+\.[\dx]+\.[\dx]+))$/.test(data.text))
            data.diagnostics.push({
                message: (0, l10n_1.t)("diagnostic.version.invalid"),
                range: new vscode_1.Range(new vscode_1.Position(data.line, data.start ?? 0), new vscode_1.Position(data.line, data.end ?? data.start ?? 0)),
                severity: vscode_1.DiagnosticSeverity.Error,
            });
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
exports.default = DiagnosticProvider;
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
const requiredScopes = {
    common: [
        "TYPE",
        "MAIN",
        "RAM",
        "VERSION",
    ],
    bot: [
        "NAME",
        "TYPE",
        "MAIN",
        "RAM",
        "VERSION",
    ],
    site: [
        "ID",
        "TYPE",
        "MAIN",
        "RAM",
        "VERSION",
    ],
};
//# sourceMappingURL=DiagnosticProvider.js.map