"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SubDomainTreeItem_1 = require("../structures/SubDomainTreeItem");
const BaseTreeDataProvider_1 = require("./BaseTreeDataProvider");
class SubDomainTreeDataProvider extends BaseTreeDataProvider_1.default {
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
        for (const subdomain of data) {
            this.children.set(subdomain, new SubDomainTreeItem_1.default({
                label: subdomain,
                subdomain,
            }));
        }
        this.clean(data);
        this.refresh();
    }
}
exports.default = SubDomainTreeDataProvider;
//# sourceMappingURL=SubDomainTreeDataProvider.js.map