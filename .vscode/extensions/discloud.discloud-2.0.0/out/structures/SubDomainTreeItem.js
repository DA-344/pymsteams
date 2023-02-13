"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const BaseTreeItem_1 = require("./BaseTreeItem");
class SubDomainTreeItem extends BaseTreeItem_1.default {
    subdomain;
    iconName;
    constructor(data) {
        data.label ??= data.subdomain;
        super(data.label, data.collapsibleState);
        this._patch(data);
    }
    _patch(data) {
        this.subdomain = data.subdomain ?? this.subdomain;
        this.label = data.subdomain ?? this.label;
        this.collapsibleState = data.collapsibleState ?? this.collapsibleState;
        this.iconName = (0, util_1.getIconName)(data) ?? this.iconName ?? "off";
        this.iconPath = (0, util_1.getIconPath)(this.iconName);
        return super._patch(data);
    }
}
exports.default = SubDomainTreeItem;
//# sourceMappingURL=SubDomainTreeItem.js.map