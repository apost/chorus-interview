import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonPrototype } from '../database/entities/PokemonPrototype';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonPrototype)
    private readonly pokemonRepository: Repository<PokemonPrototype>,
  ) {}

  async findAll(): Promise<PokemonPrototype[]> {
    return this.pokemonRepository.find();
  }
}