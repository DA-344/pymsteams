"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
require("./localize");
const Discloud_1 = require("./structures/Discloud");
const extension = new Discloud_1.default();
exports.default = extension;
async function activate(context) {
    await extension.loadEvents();
    extension.activate(context);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map