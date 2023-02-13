"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const BaseTreeItem_1 = require("./BaseTreeItem");
class CustomDomainTreeItem extends BaseTreeItem_1.default {
    domain;
    iconName;
    constructor(data) {
        data.label ??= data.domain;
        super(data.label, data.collapsibleState);
        this._patch(data);
    }
    _patch(data) {
        this.domain = data.domain ?? this.domain;
        this.label = data.domain ?? this.label;
        this.collapsibleState = data.collapsibleState ?? this.collapsibleState;
        this.iconName = (0, util_1.getIconName)(data) ?? this.iconName ?? "off";
        this.iconPath = (0, util_1.getIconPath)(this.iconName);
        return super._patch(data);
    }
}
exports.default = CustomDomainTreeItem;
//# sourceMappingURL=CustomDomainTreeItem.js.map