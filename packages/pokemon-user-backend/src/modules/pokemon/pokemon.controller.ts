import { Controller, Get, Param } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonPrototype } from '../database/entities/PokemonPrototype';
import { PokemonDto } from '../database/dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findAll(): Promise<PokemonDto[]>{
    return this.pokemonService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PokemonDto>{
    return this.pokemonService.findOne(id);
  }
}