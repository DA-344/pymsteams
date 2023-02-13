"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = require("../extension");
const util_1 = require("../util");
class VSUser {
    discloud;
    apps = [];
    appsStatus = [];
    appsTeam = [];
    customdomains = [];
    locale;
    plan;
    ramUsedMb;
    subdomains = [];
    totalRamMb;
    userID;
    username;
    constructor(discloud) {
        this.discloud = discloud;
    }
    async fetch(isVS) {
        const res = await (0, util_1.requester)("/vscode", {
            headersTimeout: 60000,
        }, isVS);
        if (!res)
            return;
        if ("user" in res)
            Object.assign(this, res.user);
        extension_1.default.emit("vscode", this);
        return this;
    }
}
exports.default = VSUser;
//# sourceMappingURL=VSUser.js.map