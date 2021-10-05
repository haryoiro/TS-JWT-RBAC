"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const routing_controllers_1 = require("routing-controllers");
function EntityFromBodyParam(paramName, options) {
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
            type: "body-param",
            parse: options && options.parse,
            required: options && options.required,
            transform: (actionProperties, value) => {
                if (value === undefined || value === null)
                    return undefined;
                const connection = typeorm_1.getConnectionManager().get(options ? options.connection : undefined);
                function buildMap(target, maps) {
                    if (!!maps.find(map => map.target === target))
                        return maps;
                    const map = { target: target, properties: {} };
                    maps.push(map);
                    connection.getMetadata(target).relations.forEach(relation => {
                        if (relation.type instanceof Function) {
                            map.properties[relation.propertyName] = relation.type;
                            buildMap(relation.type, maps);
                        }
                    });
                    return maps;
                }
                const maps = buildMap(target, []);
                if (isArray)
                    return class_transformer_1.plainToClass(target, value, { targetMaps: maps });
                return class_transformer_1.plainToClass(target, value, { targetMaps: maps });
            }
        });
    };
}
exports.EntityFromBodyParam = EntityFromBodyParam;
//# sourceMappingURL=EntityFromBodyParam.js.map