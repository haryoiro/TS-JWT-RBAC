"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../util/Utils");
const routing_controllers_1 = require("routing-controllers");
function EntityFromQuery(paramName, options) {
    return function (object, methodName, index) {
        const reflectedType = Reflect.getMetadata("design:paramtypes", object, methodName)[index];
        const isArray = reflectedType && reflectedType.name ? reflectedType.name.toLowerCase() === "array" : false;
        const target = options && options.type ? options.type : reflectedType;
        if (!target)
            throw new Error("Cannot guess type if the parameter");
        routing_controllers_1.getMetadataArgsStorage().params.push({
            object: object,
            method: methodName,
            name: paramName,
            index: index,
            type: "query",
            parse: options && options.parse,
            required: options && options.required,
            transform: (actionProperties, value) => Utils_1.entityTransform(value, target, isArray, options)
        });
    };
}
exports.EntityFromQuery = EntityFromQuery;
//# sourceMappingURL=EntityFromQuery.js.map