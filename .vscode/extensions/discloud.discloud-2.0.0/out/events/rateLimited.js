"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = require("../extension");
extension_1.default.on("rateLimited", (rateLimitData) => {
    extension_1.default.statusBar.setRateLimited(true);
    setTimeout(() => {
        extension_1.default.statusBar.setRateLimited();
    }, rateLimitData.time);
});
//# sourceMappingURL=rateLimited.js.map