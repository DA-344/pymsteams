"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GS = void 0;
const discloud_app_1 = require("discloud.app");
const glob_1 = require("glob");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
class GS {
    path;
    found = [];
    ignore;
    constructor(path, ignoreFileName, ignore = []) {
        this.path = path;
        this.ignore = new discloud_app_1.IgnoreFiles({
            fileName: ignoreFileName,
            path,
            optionalIgnoreList: ignore,
        });
        this.path = this.#normalizePath(path);
        this.found = new glob_1.GlobSync(this.path, {
            dot: true,
            ignore: this.ignore.list,
        }).found;
    }
    #normalizePath(path) {
        try {
            if (!(0, node_path_1.isAbsolute)(path))
                path = path.replace(/^(\.|~)$|^(\.|~)\/|^\/|\/$/g, "") || "**";
            path = (0, node_fs_1.statSync)(path).isDirectory() ? path + "/**" : path;
        }
        catch {
            path = path + "/**";
        }
        return path;
    }
}
exports.GS = GS;
exports.default = GS;
//# sourceMappingURL=GS.js.map