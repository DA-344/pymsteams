"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
const util_1 = require("../util");
class StatusBarItem {
    originalData;
    data;
    constructor(data) {
        this.data = vscode_1.window.createStatusBarItem(data.alignment, data.priority);
        (0, util_1.bindFunctions)(this.data);
        this.set(data);
        this.originalData = this.extractData(this.data);
        if (vscode_1.workspace.workspaceFolders?.length) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    get limited() {
        return this.text === (0, l10n_1.t)("status.text.ratelimited");
    }
    get loading() {
        return this.data.text.includes("$(loading~spin)");
    }
    get token() {
        return extension_1.default.config.get("token");
    }
    reset(data = this.originalData) {
        if (this.limited)
            return;
        this.accessibilityInformation = data.accessibilityInformation ?? this.originalData.accessibilityInformation;
        this.backgroundColor = data.backgroundColor ?? this.originalData.backgroundColor;
        this.color = data.color ?? this.originalData.color;
        this.command = data.command ?? this.originalData.command;
        this.name = data.name ?? this.originalData.name;
        this.text = data.text ?? this.originalData.text;
        this.tooltip = data.tooltip ?? this.originalData.tooltip;
        if (this.token) {
            this.setUpload();
        }
        else {
            this.setLogin();
        }
    }
    set(data) {
        this.accessibilityInformation = data.accessibilityInformation ?? this.data.accessibilityInformation;
        this.backgroundColor = data.backgroundColor ?? this.data.backgroundColor;
        this.color = data.color ?? this.data.color;
        this.command = data.command ?? this.data.command;
        this.name = data.name ?? this.data.name;
        this.text = data.text ?? this.data.text;
        this.tooltip = data.tooltip ?? this.data.tooltip;
    }
    setLogin() {
        if (this.limited)
            return;
        this.command = "discloud.login";
        this.text = (0, l10n_1.t)("status.text.login");
        this.tooltip = (0, l10n_1.t)("status.tooltip.login");
    }
    setCommiting() {
        if (this.limited)
            return;
        this.command = undefined;
        this.text = (0, l10n_1.t)("status.text.commiting");
        this.tooltip = undefined;
    }
    setLoading() {
        if (this.limited)
            return;
        this.command = undefined;
        this.text = (0, l10n_1.t)("status.text.loading");
        this.tooltip = undefined;
    }
    setRateLimited(force) {
        if (!force && this.limited) {
            this.text = this.originalData.text;
            this.reset();
        }
        else {
            this.command = undefined;
            this.backgroundColor = new vscode_1.ThemeColor("statusBarItem.warningBackground");
            this.text = (0, l10n_1.t)("status.text.ratelimited");
            this.tooltip = (0, l10n_1.t)("status.tooltip.ratelimited");
        }
    }
    setUpload() {
        if (this.limited)
            return;
        this.command = "discloud.upload";
        this.text = (0, l10n_1.t)("status.text.upload");
        this.tooltip = (0, l10n_1.t)("status.tooltip.upload");
    }
    setUploading() {
        if (this.limited)
            return;
        this.command = undefined;
        this.text = (0, l10n_1.t)("status.text.uploading");
        this.tooltip = undefined;
    }
    setText(text) {
        if (this.limited)
            return;
        if (typeof text === "string")
            this.text = text;
    }
    extractData(instance) {
        const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
        const data = {};
        for (const propertyName of propertyNames)
            data[propertyName] = instance[propertyName];
        return data;
    }
    get accessibilityInformation() {
        return this.data.accessibilityInformation;
    }
    set accessibilityInformation(accessibilityInformation) {
        this.data.accessibilityInformation = accessibilityInformation;
    }
    get alignment() {
        return this.data.alignment;
    }
    get backgroundColor() {
        return this.data.backgroundColor;
    }
    set backgroundColor(backgroundColor) {
        this.data.backgroundColor = backgroundColor;
    }
    get color() {
        return this.data.color;
    }
    set color(color) {
        this.data.color = color;
    }
    get command() {
        return this.data.command;
    }
    set command(command) {
        this.data.command = command;
    }
    get dispose() {
        return this.data.dispose;
    }
    get hide() {
        return this.data.hide;
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }
    set name(name) {
        this.data.name = name;
    }
    get priority() {
        return this.data.priority;
    }
    get show() {
        return this.data.show;
    }
    get text() {
        return this.data.text;
    }
    set text(text) {
        this.data.text = text;
    }
    get tooltip() {
        return this.data.tooltip;
    }
    set tooltip(tooltip) {
        this.data.tooltip = tooltip;
    }
}
exports.default = StatusBarItem;
//# sourceMappingURL=StatusBarItem.js.map