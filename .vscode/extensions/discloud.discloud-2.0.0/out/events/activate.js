"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
const AppTreeDataProvider_1 = require("../providers/AppTreeDataProvider");
const CompletionItemProvider_1 = require("../providers/CompletionItemProvider");
const CustomDomainTreeDataProvider_1 = require("../providers/CustomDomainTreeDataProvider");
const DiagnosticProvider_1 = require("../providers/DiagnosticProvider");
const SubDomainTreeDataProvider_1 = require("../providers/SubDomainTreeDataProvider");
const TeamAppTreeDataProvider_1 = require("../providers/TeamAppTreeDataProvider");
const UserTreeDataProvider_1 = require("../providers/UserTreeDataProvider");
extension_1.default.once("activate", (context) => {
    extension_1.default.loadStatusBar();
    extension_1.default.statusBar.setLoading();
    new DiagnosticProvider_1.default();
    const completionItemProvider = new CompletionItemProvider_1.default();
    extension_1.default.appTree = new AppTreeDataProvider_1.default("discloud-apps");
    extension_1.default.customDomainTree = new CustomDomainTreeDataProvider_1.default("discloud-domains");
    extension_1.default.subDomainTree = new SubDomainTreeDataProvider_1.default("discloud-subdomains");
    extension_1.default.teamAppTree = new TeamAppTreeDataProvider_1.default("discloud-teams");
    extension_1.default.userTree = new UserTreeDataProvider_1.default("discloud-user");
    extension_1.default.loadCommands();
    const disposableConfiguration = vscode_1.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration("discloud.token")) {
            extension_1.default.statusBar.reset();
        }
        if (event.affectsConfiguration("discloud.auto.refresh")) {
            if (extension_1.default.autoRefresher.interval) {
                extension_1.default.autoRefresher.setInterval();
            }
            else {
                extension_1.default.autoRefresher.stop();
            }
        }
    });
    const disposableWorkspaceFolders = vscode_1.workspace.onDidChangeWorkspaceFolders(() => {
        if (extension_1.default.workspaceAvailable) {
            extension_1.default.statusBar.show();
        }
        else {
            extension_1.default.statusBar.hide();
        }
    });
    context.subscriptions.push(completionItemProvider.disposable, disposableConfiguration, disposableWorkspaceFolders);
    extension_1.default.statusBar.reset();
    if (extension_1.default.token)
        extension_1.default.user.fetch(true);
});
//# sourceMappingURL=activate.js.map