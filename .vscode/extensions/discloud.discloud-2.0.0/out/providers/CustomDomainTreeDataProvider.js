"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomDomainTreeItem_1 = require("../structures/CustomDomainTreeItem");
const BaseTreeDataProvider_1 = require("./BaseTreeDataProvider");
class CustomDomainTreeDataProvider extends BaseTreeDataProvider_1.default {
    constructor(viewId) {
        super(viewId);
    }
    clean(data) {
        for (const child of this.children.keys()) {
            if (!data.includes(child)) {
                this.children.delete(child);
            }
        }
    }
    update(data) {
        if (!data)
            return;
        for (const domain of data) {
            this.children.set(domain, new CustomDomainTreeItem_1.default({
                label: domain,
                domain,
            }));
        }
        this.clean(data);
        this.refresh();
    }
}
exports.default = CustomDomainTreeDataProvider;
//# sourceMappingURL=CustomDomainTreeDataProvider.js.map