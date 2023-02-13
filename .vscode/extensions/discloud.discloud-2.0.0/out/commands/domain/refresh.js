"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = require("../../extension");
const Command_1 = require("../../structures/Command");
class default_1 extends Command_1.default {
    constructor() {
        super();
    }
    async run() {
        await extension_1.default.appTree.fetch();
    }
}
exports.default = default_1;
//# sourceMappingURL=refresh.js.map