"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchOnArray = exports.getIconName = exports.getIconPath = exports.extractData = exports.bindFunctions = void 0;
const node_path_1 = require("node:path");
function bindFunctions(instance, bind) {
    if (!instance)
        return;
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
    for (const propertyName of propertyNames)
        if (typeof instance[propertyName] === "function")
            (bind ?? instance)[propertyName] = instance[propertyName].bind(bind ?? instance);
}
exports.bindFunctions = bindFunctions;
function extractData(instance) {
    if (!instance)
        return {};
    const propertyNames = [...Object.getOwnPropertyNames(Object.getPrototypeOf(instance)), ...Object.keys(instance)];
    const data = {};
    for (const propertyName of propertyNames)
        data[propertyName] = instance[propertyName];
    return data;
}
exports.extractData = extractData;
const resourcesDir = (0, node_path_1.join)(__dirname, "..", "..", "resources");
function getIconPath(iconName, iconExt = "svg") {
    return {
        dark: (0, node_path_1.join)(resourcesDir, "dark", `${iconName}.${iconExt}`),
        light: (0, node_path_1.join)(resourcesDir, "light", `${iconName}.${iconExt}`),
    };
}
exports.getIconPath = getIconPath;
function getIconName(data) {
    if ("online" in data)
        return data.online ? "on" :
            data.ramKilled ? "ramKilled" :
                data.exitCode === 1 ? "errorCode" :
                    "off";
    if ("container" in data)
        return data.container === "Online" ? "on" :
            data.ramKilled ? "ramKilled" :
                data.exitCode === 1 ? "errorCode" :
                    "off";
}
exports.getIconName = getIconName;
function matchOnArray(array, pattern) {
    const regex = new RegExp(`${pattern}$`, "i");
    for (const iterator of array)
        if (regex.test(iterator))
            return iterator;
}
exports.matchOnArray = matchOnArray;
//# sourceMappingURL=utils.js.map