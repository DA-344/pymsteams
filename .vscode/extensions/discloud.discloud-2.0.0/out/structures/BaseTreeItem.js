"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class BaseTreeItem extends vscode_1.TreeItem {
    children = new Map();
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
    }
    _clone() {
        return Object.assign(Object.create(this), this);
    }
    _patch(data) {
        return this;
    }
    _update(data) {
        const clone = this._clone();
        this._patch(data);
        return clone;
    }
}
exports.default = BaseTreeItem;
//# sourceMappingURL=BaseTreeItem.js.map