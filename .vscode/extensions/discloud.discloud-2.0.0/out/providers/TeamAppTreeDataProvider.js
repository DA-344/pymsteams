"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const vscode_1 = require("vscode");
const TeamAppTreeItem_1 = require("../structures/TeamAppTreeItem");
const util_1 = require("../util");
const BaseTreeDataProvider_1 = require("./BaseTreeDataProvider");
class TeamAppTreeDataProvider extends BaseTreeDataProvider_1.default {
    constructor(viewId) {
        super(viewId);
    }
    async getApps() {
        const response = await (0, util_1.requester)("/team", {}, true);
        if (response?.status !== "ok")
            return;
        this.clean(response.apps);
        for (const app of response.apps) {
            const oldApp = this.children.get(app.id);
            if (oldApp) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                oldApp._patch(app);
            }
            else {
                this.children.set(app.id, new TeamAppTreeItem_1.default({
                    collapsibleState: this.children.size ? vscode_1.TreeItemCollapsibleState.Collapsed : vscode_1.TreeItemCollapsibleState.Expanded,
                    ...app,
                }));
            }
        }
        if (this.children.size) {
            this.refresh();
            await vscode_1.window.withProgress({
                location: { viewId: this.viewId },
                title: (0, l10n_1.t)("refreshing"),
            }, async () => {
                await this.getStatus();
            });
        }
        else {
            this.init();
        }
    }
    async getStatus(appId = "all") {
        const res = await (0, util_1.requester)(discloud_app_1.Routes.teamStatus(appId), {}, true);
        if (res?.status !== "ok")
            return;
        if (Array.isArray(res.apps)) {
            for (const app of res.apps) {
                const oldApp = this.children.get(app.id);
                if (oldApp) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    oldApp._patch(app);
                }
                else {
                    this.children.set(app.id, new TeamAppTreeItem_1.default({
                        collapsibleState: this.children.size ? vscode_1.TreeItemCollapsibleState.Collapsed : vscode_1.TreeItemCollapsibleState.Expanded,
                        ...app,
                    }));
                }
            }
            if (this.children.size) {
                this.clean(res.apps);
                this.refresh();
            }
            else {
                this.init();
            }
        }
        else {
            const app = this.children.get(appId);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            app?._patch(res.apps);
            this.refresh();
        }
    }
    clean(data) {
        for (const child of this.children.keys()) {
            if (!data.some(app => app.id === child)) {
                this.children.delete(child);
            }
        }
    }
    delete(id) {
        this.children.delete(id);
        this.refresh();
    }
    addRawApps(data) {
        for (const app of data) {
            this.addRawApp(app);
        }
        this.clean(data);
        this.refresh();
    }
    addRawApp(data) {
        const app = this.children.get(data.id);
        if (app) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            app._patch(data);
        }
        else {
            this.children.set(data.id, new TeamAppTreeItem_1.default({
                collapsibleState: this.children.size ? vscode_1.TreeItemCollapsibleState.Collapsed : vscode_1.TreeItemCollapsibleState.Expanded,
                ...data,
            }));
        }
        this.refresh();
    }
    edit(appId, data) {
        const app = this.children.get(appId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        app?._patch(data);
    }
    async fetch() {
        await vscode_1.window.withProgress({
            location: { viewId: this.viewId },
            title: (0, l10n_1.t)("refreshing"),
        }, async () => {
            await this.getApps();
        });
    }
    init() {
        this.children.clear();
        this.children.set("x", new TeamAppTreeItem_1.default({
            label: "Nenhuma aplicação foi encontrada.",
            iconName: "x",
        }));
    }
}
exports.default = TeamAppTreeDataProvider;
//# sourceMappingURL=TeamAppTreeDataProvider.js.map