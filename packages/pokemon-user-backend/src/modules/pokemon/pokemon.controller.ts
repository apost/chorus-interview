import { Controller, Get } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonPrototype } from '@entities/PokemonPrototype';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findAll(): Promise<PokemonPrototype[]>{
    return this.pokemonService.findAll();
  }
}