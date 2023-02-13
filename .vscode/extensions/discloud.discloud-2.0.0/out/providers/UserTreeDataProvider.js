"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserTreeItem_1 = require("../structures/UserTreeItem");
const BaseTreeDataProvider_1 = require("./BaseTreeDataProvider");
class UserTreeDataProvider extends BaseTreeDataProvider_1.default {
    constructor(viewId) {
        super(viewId);
    }
    update(user) {
        this.children.clear();
        this.children.set(user.userID, new UserTreeItem_1.default(user));
        this.refresh();
    }
}
exports.default = UserTreeDataProvider;
//# sourceMappingURL=UserTreeDataProvider.js.map