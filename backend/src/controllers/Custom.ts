import {
  JsonController,
  Get,
  QueryParams,
  Param,
} from 'routing-controllers';
import { IsInt, IsOptional } from 'class-validator';

interface Book {
  id: number;
  name: string;
}

const books: Book[] = [
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
]

class GetPokemonQuery {
  @IsInt()
  @IsOptional()
  limit?: number;

  @IsInt()
  @IsOptional()
  offset?: number;
}

@JsonController()
export class PokemonController {
  @Get('/book')
  async pokemons(@QueryParams() query: GetPokemonQuery): Promise<Book[]> {
    const { offset = 0, limit = 100 } = query;
    return books.slice(offset, offset + limit);
  }

  @Get('/book/:id')
  async Book(@Param('id') id: number): Promise<Book> {
    const Book = books.find((Book) => Book.id === id);
    if (Book) {
      return Book;
    }
    throw new Error('no Book');
  }
}