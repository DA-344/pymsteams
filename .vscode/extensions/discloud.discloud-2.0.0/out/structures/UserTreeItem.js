"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const vscode_1 = require("vscode");
const BaseTreeItem_1 = require("./BaseTreeItem");
const UserChildTreeItem_1 = require("./UserChildTreeItem");
class UserTreeItem extends BaseTreeItem_1.default {
    iconName;
    userID;
    constructor(data) {
        data.label ??= data.username ?
            `${data.username} - ID ${data.userID}` :
            `${data.userID}`;
        super(data.label, data.collapsibleState ??= vscode_1.TreeItemCollapsibleState.Expanded);
        this._patch(data);
    }
    _patch(data) {
        this.userID ??= data.userID;
        this.label ??= "userID" in data ?
            `${data.userID}` :
            `${data.label}`;
        if (data.children instanceof Map)
            this.children = data.children;
        if (("ramUsedMb" in data) && ("totalRamMb" in data))
            this.children.set("ram", new UserChildTreeItem_1.default({
                label: (0, l10n_1.t)("label.available.ram"),
                description: `${data.ramUsedMb}/${data.totalRamMb}`,
            }));
        if ("plan" in data)
            this.children.set("plan", new UserChildTreeItem_1.default({
                label: (0, l10n_1.t)("plan"),
                description: data.plan,
            }));
        if ("locale" in data)
            this.children.set("locale", new UserChildTreeItem_1.default({
                label: (0, l10n_1.t)("locale"),
                description: data.locale,
            }));
        if ("apps" in data)
            this.children.set("apps", new UserChildTreeItem_1.default({
                label: (0, l10n_1.t)("label.apps.amount"),
                description: `${data.apps?.length}`,
            }));
        if ("appsTeam" in data)
            this.children.set("team", new UserChildTreeItem_1.default({
                label: (0, l10n_1.t)("label.team.apps.amount"),
                description: `${data.appsTeam?.length}`,
            }));
        if ("customdomains" in data)
            this.children.set("domains", new UserChildTreeItem_1.default({
                label: (0, l10n_1.t)("label.domains.amount"),
                description: `${data.customdomains?.length}`,
            }));
        if ("subdomains" in data)
            this.children.set("subdomains", new UserChildTreeItem_1.default({
                label: (0, l10n_1.t)("label.subdomains.amount"),
                description: `${data.subdomains?.length}`,
            }));
        return super._patch(data);
    }
}
exports.default = UserTreeItem;
//# sourceMappingURL=UserTreeItem.js.map