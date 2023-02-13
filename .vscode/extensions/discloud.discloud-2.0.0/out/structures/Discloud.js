"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const node_events_1 = require("node:events");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const vscode_1 = require("vscode");
const AutoRefresh_1 = require("./AutoRefresh");
const StatusBarItem_1 = require("./StatusBarItem");
const VSUser_1 = require("./VSUser");
const fileExt = (0, node_path_1.extname)(__filename);
class Discloud extends node_events_1.EventEmitter {
    autoRefresher;
    context;
    appTree;
    customDomainTree;
    subDomainTree;
    teamAppTree;
    userTree;
    statusBar;
    cache = new Map();
    commands = new Map();
    bars = new Map();
    user;
    constructor() {
        super();
        this.user = new VSUser_1.default(this);
    }
    get config() {
        return vscode_1.workspace.getConfiguration("discloud");
    }
    get hasToken() {
        if (this.token)
            return true;
        vscode_1.window.showErrorMessage((0, l10n_1.t)("missing.token"));
        return false;
    }
    get token() {
        return this.config.get("token");
    }
    get workspaceFolder() {
        return vscode_1.workspace.workspaceFolders?.[0].uri.fsPath.replace(/\\/g, "/");
    }
    get workspaceAvailable() {
        return Boolean(vscode_1.workspace.workspaceFolders?.length);
    }
    async copyFilePath() {
        await vscode_1.commands.executeCommand("copyFilePath");
        const copied = await vscode_1.env.clipboard.readText().then(a => a.replace(/\\/g, "/"));
        const paths = copied.split(/\r?\n/g).filter(path => !discloud_app_1.allBlockedFilesRegex.test(path));
        if (!paths.length && this.workspaceFolder)
            return [this.workspaceFolder];
        if (paths.length === 1 && paths[0] === "." && this.workspaceFolder)
            return [this.workspaceFolder];
        return paths;
    }
    async loadCommands(dir = (0, node_path_1.join)(__dirname, "..", "commands"), category = "discloud") {
        var _a;
        if (!(0, node_fs_1.existsSync)(dir))
            return;
        const files = (0, node_fs_1.readdirSync)(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                this.loadCommands((0, node_path_1.join)(dir, file.name), `${category}.${file.name}`);
                continue;
            }
            if (file.isFile()) {
                if (!file.name.endsWith(fileExt))
                    continue;
                const imported = await (_a = `${(0, node_path_1.join)(dir, file.name)}`, Promise.resolve().then(() => require(_a)));
                let command;
                try {
                    command = new (imported.default ?? imported)(this);
                }
                catch {
                    command = imported.default ?? imported;
                }
                const commandName = `${category}.${file.name.replace((0, node_path_1.extname)(file.name), "")}`;
                const disposable = vscode_1.commands.registerCommand(commandName, async (...args) => {
                    if (!command.data.noToken)
                        if (!this.hasToken)
                            return;
                    const taskData = {};
                    if (command.data.progress) {
                        await vscode_1.window.withProgress(command.data.progress, async (progress, token) => {
                            token.onCancellationRequested(() => this.resetStatusBar());
                            taskData.progress = progress;
                            taskData.token = token;
                            await command.run(taskData, ...args);
                        });
                    }
                    else {
                        command.run(taskData, ...args);
                    }
                });
                this.context.subscriptions.push(disposable);
                this.commands.set(commandName, command);
                continue;
            }
        }
    }
    async loadEvents(path = (0, node_path_1.join)(__dirname, "..", "events")) {
        var _a;
        if (!(0, node_fs_1.existsSync)(path))
            return;
        const files = (0, node_fs_1.readdirSync)(path, { withFileTypes: true });
        for (const file of files)
            if (file.isFile()) {
                if (!file.name.endsWith(fileExt))
                    continue;
                await (_a = `${(0, node_path_1.join)(path, file.name)}`, Promise.resolve().then(() => require(_a)));
            }
    }
    loadStatusBar() {
        this.statusBar = new StatusBarItem_1.default({
            alignment: vscode_1.StatusBarAlignment.Left,
            priority: 40,
            text: (0, l10n_1.t)("status.text"),
            tooltip: (0, l10n_1.t)("status.tooltip"),
        });
        this.bars.set("statusbar", this.statusBar);
        return this.bars;
    }
    async resetStatusBar(bars) {
        if (bars instanceof StatusBarItem_1.default)
            return bars.reset();
        for (const bar of bars ?? this.bars.values())
            bar.reset();
    }
    activate(context) {
        this.context = context;
        this.emit("activate", context);
        this.autoRefresher = new AutoRefresh_1.default();
    }
}
exports.default = Discloud;
//# sourceMappingURL=Discloud.js.map