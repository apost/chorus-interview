import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonPrototype } from '../database/entities/PokemonPrototype';
import { PokemonDto } from '@dto/pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonPrototype)
    private readonly pokemonRepository: Repository<PokemonPrototype>,
  ) {}

  private toPokemonDto(pokemon: Partial<PokemonPrototype | null> ): PokemonDto {
    return {
      display_id: pokemon?.display_id || -1,
      name: pokemon?.name || 'MissingNo.',
      prototype_id: pokemon?.prototype_id || -1,
    };
  }

  async findAll(): Promise<PokemonDto[]> {
    return (await this.pokemonRepository.find()).map(this.toPokemonDto).sort(
      (a, b) => a.display_id - b.display_id
    );
  }

  async findOne(id: number): Promise<PokemonDto> {
    const match = await this.pokemonRepository.findOne({where: {display_id: id}});
    if (!match) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return this.toPokemonDto(match);
  }
}