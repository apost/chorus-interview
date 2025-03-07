import { DataSource } from "typeorm";
import { PokemonPrototype } from "../entities/PokemonPrototype";

export const pokemonPrototypeProviders = [
    {
        provide: 'POKEMON_PROTOTYPE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PokemonPrototype),
        inject: ['DataSource'],
    },
];