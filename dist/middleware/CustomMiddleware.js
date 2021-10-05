"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMiddleware = void 0;
class CustomMiddleware {
    // interface implementation is optional
    use(request, response, next) {
        console.log('do something...');
        next();
    }
}
exports.CustomMiddleware = CustomMiddleware;
//# sourceMappingURL=CustomMiddleware.js.map