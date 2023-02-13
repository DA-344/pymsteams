"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = require("../extension");
extension_1.default.on("vscode", (user) => {
    if (user)
        extension_1.default.userTree.update(Object.create(user));
    if ("appsStatus" in user)
        extension_1.default.appTree.addRawApps(user.appsStatus);
    if ("appsTeam" in user)
        extension_1.default.teamAppTree.addRawApps(user.appsTeam.map(id => ({ id })));
    if ("subdomains" in user)
        extension_1.default.subDomainTree.update(user.subdomains);
    if ("customdomains" in user)
        extension_1.default.customDomainTree.update(user.customdomains);
});
//# sourceMappingURL=vscode.js.map