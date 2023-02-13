"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
class BaseTreeDataProvider {
    viewId;
    _onDidChangeTreeData = new vscode_1.EventEmitter();
    get onDidChangeTreeData() {
        return this._onDidChangeTreeData.event;
    }
    ;
    children = new Map();
    constructor(viewId) {
        this.viewId = viewId;
        const disposable = vscode_1.window.registerTreeDataProvider(viewId, this);
        extension_1.default.context.subscriptions.push(disposable);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return [...element?.children?.values() ?? this.children.values()];
    }
    getParent(element) {
        return element;
    }
    resolveTreeItem(item, element, token) {
        return element ?? item;
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.default = BaseTreeDataProvider;
//# sourceMappingURL=BaseTreeDataProvider.js.map