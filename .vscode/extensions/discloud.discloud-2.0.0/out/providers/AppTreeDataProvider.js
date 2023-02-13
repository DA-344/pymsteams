"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const discloud_app_1 = require("discloud.app");
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
const AppTreeItem_1 = require("../structures/AppTreeItem");
const util_1 = require("../util");
const BaseTreeDataProvider_1 = require("./BaseTreeDataProvider");
class AppTreeDataProvider extends BaseTreeDataProvider_1.default {
    constructor(viewId) {
        super(viewId);
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
            this.children.set(data.id, new AppTreeItem_1.default({
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
    async getStatus(appId) {
        const res = await (0, util_1.requester)(discloud_app_1.Routes.appStatus(appId));
        if (!res.apps)
            return;
        this.edit(appId, res.apps);
        this.refresh();
    }
    async fetch() {
        await vscode_1.window.withProgress({
            location: { viewId: this.viewId },
            title: (0, l10n_1.t)("refreshing"),
        }, async () => {
            extension_1.default.statusBar.setLoading();
            await extension_1.default.user.fetch(true);
            extension_1.default.statusBar.reset();
        });
    }
    init() {
        this.children.clear();
        this.children.set("x", new AppTreeItem_1.default({
            label: "Nenhuma aplicação foi encontrada.",
            iconName: "x",
        }));
    }
}
exports.default = AppTreeDataProvider;
//# sourceMappingURL=AppTreeDataProvider.js.map