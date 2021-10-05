"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../util/Utils");
const routing_controllers_1 = require("routing-controllers");
function EntityFromCookie(paramName, options) {
    return function (object, method, index) {
        const reflectedType = Reflect.getMetadata("design:paramtypes", object, method)[index];
        const isArray = reflectedType && reflectedType.name ? reflectedType.name.toLowerCase() === "array" : false;
        const target = options && options.type ? options.type : reflectedType;
        if (!target)
            throw new Error("Cannot guess type if the parameter");
        routing_controllers_1.getMetadataArgsStorage().params.push({
            object: object,
            method: method,
            index: index,
            name: paramName,
            type: "cookie",
            parse: options && options.parse,
            required: options && options.required,
            transform: (actionProperties, value) => Utils_1.entityTransform(value, target, isArray, options)
        });
    };
}
exports.EntityFromCookie = EntityFromCookie;
//# sourceMappingURL=EntityFromCookie.js.map