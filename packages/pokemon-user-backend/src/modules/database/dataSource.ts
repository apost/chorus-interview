import { DataSource } from 'typeorm';
import { Profile } from './entities/Profile';
import { PokemonInstance } from './entities/PokemonInstance';
import { PokemonPrototype } from './entities/PokemonPrototype';
import { Team } from './entities/Team';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'pokemon',
  synchronize: true,
  entities: [Profile, PokemonInstance, Team, PokemonPrototype],
  migrations: ['migration/*.ts'],
});