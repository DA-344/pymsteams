"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const util_1 = require("../util");
class UserChildTreeItem extends vscode_1.TreeItem {
    iconName;
    userID;
    children;
    constructor(options) {
        super(options.label, options.collapsibleState);
        this.description = options.description;
        this.iconName = options.iconName;
        this.tooltip = options.tooltip;
        this.userID = options.userID;
        if (this.iconName)
            this.iconPath = (0, util_1.getIconPath)(this.iconName);
        if (options.children)
            this.children = new Map(options.children.map((child) => [child.label, child]));
    }
}
exports.default = UserChildTreeItem;
//# sourceMappingURL=UserChildTreeItem.js.map