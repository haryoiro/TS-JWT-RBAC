"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
const routing_controllers_1 = require("routing-controllers");
const class_validator_1 = require("class-validator");
const books = [
    {
        id: 1,
        name: '人間失格',
    },
    {
        id: 2,
        name: '古事記',
    },
    {
        id: 3,
        name: '吾輩は猫である',
    }
];
class GetPokemonQuery {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetPokemonQuery.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetPokemonQuery.prototype, "offset", void 0);
let PokemonController = class PokemonController {
    async pokemons(query) {
        const { offset = 0, limit = 100 } = query;
        return books.slice(offset, offset + limit);
    }
    async Book(id) {
        const Book = books.find((Book) => Book.id === id);
        if (Book) {
            return Book;
        }
        throw new Error('no Book');
    }
};
__decorate([
    (0, routing_controllers_1.Get)('/book'),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetPokemonQuery]),
    __metadata("design:returntype", Promise)
], PokemonController.prototype, "pokemons", null);
__decorate([
    (0, routing_controllers_1.Get)('/book/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PokemonController.prototype, "Book", null);
PokemonController = __decorate([
    (0, routing_controllers_1.JsonController)()
], PokemonController);
exports.PokemonController = PokemonController;
//# sourceMappingURL=Custom.js.map