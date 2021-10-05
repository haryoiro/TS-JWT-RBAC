"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
/**
 * @internal
 */
function entityTransform(value, target, isArray, options) {
    if (value === null || value === undefined)
        return Promise.resolve(value);
    const connection = typeorm_1.getConnectionManager().get(options ? options.connection : undefined);
    const repository = connection.getRepository(target);
    if (options) {
        if (isArray) {
            if (!options.property)
                throw new Error("Conditional property must be set to perform a query to multiple objects.");
            return repository.find({ [options.property]: value });
        }
        else if (options.property) {
            return repository.findOne({ [options.property]: value });
        }
    }
    return repository.findOne(value);
}
exports.entityTransform = entityTransform;
//# sourceMappingURL=Utils.js.map