"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.required_files = exports.blockFilesRegex = exports.blocked_files = exports.cpu_arch = exports.os_platform = exports.os_release = exports.os_name = exports.version = void 0;
const node_fs_1 = require("node:fs");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
exports.version = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(__dirname, "..", "..", "package.json"), "utf8")).version;
exports.os_name = (0, node_os_1.type)();
exports.os_release = (0, node_os_1.release)().split?.(".").slice(0, 2).join(".") ?? (0, node_os_1.release)();
exports.os_platform = (0, node_os_1.platform)();
exports.cpu_arch = (0, node_os_1.arch)();
exports.blocked_files = {
    common: [".git", ".vscode"],
    go: [],
    js: ["node_modules", "package-lock.json", "yarn.lock"],
    py: [],
    rb: ["Gemfile.lock"],
    rs: ["Cargo.lock", "target"],
    ts: ["node_modules", "package-lock.json", "yarn.lock"],
};
exports.blockFilesRegex = RegExp(`(${Object.values(exports.blocked_files).flat().join("|")})`.replace(/\./g, "\\."), "i");
exports.required_files = {
    common: ["discloud.config"],
    go: ["go.mod", "go.sum"],
    js: ["package.json"],
    py: ["requirements.txt"],
    rb: ["Gemfile"],
    rs: ["Cargo.toml"],
    ts: ["package.json"],
};
//# sourceMappingURL=constants.js.map