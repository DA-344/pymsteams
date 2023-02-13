"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const l10n_1 = require("@vscode/l10n");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const vscode_1 = require("vscode");
function importJSON(path) {
    try {
        if ((0, node_fs_1.existsSync)(path))
            return JSON.parse((0, node_fs_1.readFileSync)(path, "utf8"));
        return {};
    }
    catch {
        return {};
    }
}
const bundleDir = (0, node_path_1.join)(__dirname, "..", "l10n");
const packageDir = (0, node_path_1.join)(__dirname, "..");
(0, l10n_1.config)({
    contents: {
        ...importJSON((0, node_path_1.join)(packageDir, "package.nls.json")),
        ...importJSON((0, node_path_1.join)(packageDir, `package.nls.${vscode_1.env.language.split(/\W+/)[0]}.json`)),
        ...importJSON((0, node_path_1.join)(packageDir, `package.nls.${vscode_1.env.language}.json`)),
        ...importJSON((0, node_path_1.join)(bundleDir, "bundle.l10n.json")),
        ...importJSON((0, node_path_1.join)(bundleDir, `bundle.l10n.${vscode_1.env.language.split(/\W+/)[0]}.json`)),
        ...importJSON((0, node_path_1.join)(bundleDir, `bundle.l10n.${vscode_1.env.language}.json`)),
    },
});
//# sourceMappingURL=localize.js.map