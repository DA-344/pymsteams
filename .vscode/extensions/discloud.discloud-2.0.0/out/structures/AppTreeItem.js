"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const util_1 = require("../util");
const AppChildTreeItem_1 = require("./AppChildTreeItem");
const BaseTreeItem_1 = require("./BaseTreeItem");
class AppTreeItem extends BaseTreeItem_1.default {
    data;
    iconName;
    appId;
    appType;
    constructor(data) {
        data.label ??= "name" in data ?
            `${data.name}${data.name?.includes(`${data.id}`) ? "" :
                ` - ID ${data.id}`}` :
            `${data.id}`;
        super(data.label, data.collapsibleState);
        this.data = data;
        this._patch(data);
    }
    _patch(data) {
        this.appId ??= data.appId ?? data.id;
        this.label ??= "name" in data ?
            `${data.name}${data.name?.includes(`${this.appId}`) ? "" :
                ` - ID ${data.id}`}` :
            `${data.id}`;
        this.appType = data.appType ?? "name" in data ? (data.name?.includes(`${data.id}`) ? "site" : "bot") : this.appType;
        this.iconName = (0, util_1.getIconName)(data) ?? data.iconName ?? this.iconName ?? "off";
        this.iconPath = (0, util_1.getIconPath)(this.iconName);
        if (data.children instanceof Map)
            this.children = data.children;
        if ("container" in data)
            this.children.set("container", new AppChildTreeItem_1.default({
                label: (0, l10n_1.t)("container"),
                description: data.container,
                iconName: "container",
                appId: this.appId,
            }));
        if ("memory" in data)
            this.children.set("memory", new AppChildTreeItem_1.default({
                label: (0, l10n_1.t)("label.ram"),
                description: data.memory,
                iconName: "ram",
                appId: this.appId,
            }));
        if ("cpu" in data)
            this.children.set("cpu", new AppChildTreeItem_1.default({
                label: (0, l10n_1.t)("label.cpu"),
                description: data.cpu,
                iconName: "cpu",
                appId: this.appId,
            }));
        if ("ssd" in data)
            this.children.set("ssd", new AppChildTreeItem_1.default({
                label: (0, l10n_1.t)("label.ssd"),
                description: data.ssd,
                iconName: "ssd",
                appId: this.appId,
            }));
        if ("netIO" in data)
            this.children.set("netIO", new AppChildTreeItem_1.default({
                label: (0, l10n_1.t)("network"),
                description: `⬆${data.netIO?.up} ⬇${data.netIO?.down}`,
                iconName: "network",
                appId: this.appId,
            }));
        if ("last_restart" in data)
            this.children.set("last_restart", new AppChildTreeItem_1.default({
                label: (0, l10n_1.t)("last.restart"),
                description: data.last_restart,
                iconName: "uptime",
                appId: this.appId,
            }));
        return super._patch(data);
    }
}
exports.default = AppTreeItem;
//# sourceMappingURL=AppTreeItem.js.map