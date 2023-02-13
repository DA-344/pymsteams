"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zip = void 0;
const archiver_1 = require("archiver");
const node_fs_1 = require("node:fs");
class Zip {
    file;
    options;
    stream;
    zip;
    constructor(file, format = "zip", options = {}) {
        this.file = file;
        this.options = options;
        if ((0, node_fs_1.existsSync)(file))
            try {
                (0, node_fs_1.rmSync)(file);
            }
            catch { }
        ;
        this.#create(file, format, options);
    }
    #create(file = this.file, format = "zip", options = this.options) {
        this.zip = (0, archiver_1.create)(format, options);
        (0, node_fs_1.writeFileSync)(file, "");
        this.stream = (0, node_fs_1.createWriteStream)(file);
        this.zip.pipe(this.stream);
    }
    appendFileList(fileList = [], targetPath) {
        const targetRegex = RegExp(`${targetPath}\\/?`, "i");
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const name = file.replace(targetRegex, "");
            if ((0, node_fs_1.existsSync)(file))
                if ((0, node_fs_1.statSync)(file).isFile())
                    this.zip.file(file, { name });
        }
    }
    destroy() {
        try {
            this.zip.destroy();
            this.stream.destroy();
            (0, node_fs_1.unlinkSync)(this.file);
            (0, node_fs_1.rmSync)(this.file);
        }
        catch { }
    }
    async finalize() {
        return this.zip.finalize().then(() => true);
    }
}
exports.Zip = Zip;
;
exports.default = Zip;
//# sourceMappingURL=Zip.js.map