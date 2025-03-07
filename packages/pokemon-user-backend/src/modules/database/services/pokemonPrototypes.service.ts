import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PokemonPrototype } from '../entities/PokemonPrototype';

@Injectable()
export class PokemonPrototypesService {
    constructor(
        @Inject('POKEMON_PROTOTYPE_REPOSITORY')
        private pokemonPrototypeRepository: Repository<PokemonPrototype>,
    ) {}

    async findAll(): Promise<PokemonPrototype[]> {
        return this.pokemonPrototypeRepository.find();
    }  
}