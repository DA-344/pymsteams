"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = require("../extension");
class AutoRefresh {
    timer;
    constructor() {
        if (!extension_1.default.config.has("auto.refresh"))
            extension_1.default.config.update("auto.refresh", 60);
        if (this.interval)
            this.setInterval();
    }
    get interval() {
        return extension_1.default.config.get("auto.refresh");
    }
    refresh() {
        if (extension_1.default.token) {
            extension_1.default.statusBar.setLoading();
            extension_1.default.user.fetch(true);
            extension_1.default.statusBar.reset();
        }
    }
    stop() {
        try {
            clearInterval(this.timer);
        }
        catch { }
        ;
    }
    setInterval(interval = this.interval) {
        if (interval && interval < 30) {
            interval = 30;
            extension_1.default.config.update("auto.refresh", 30);
        }
        this.stop();
        if (interval)
            this.timer = setInterval(this.refresh, interval * 1000);
    }
}
exports.default = AutoRefresh;
//# sourceMappingURL=AutoRefresh.js.map