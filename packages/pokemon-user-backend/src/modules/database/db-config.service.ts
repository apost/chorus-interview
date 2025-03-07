import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// To-Do - update to the nestjs dynamic configuration module
//import { ConfigModule, ConfigService } from '@nestjs/config';


import { Profile } from './entities/Profile';
import { PokemonInstance } from './entities/PokemonInstance';
import { PokemonPrototype } from './entities/PokemonPrototype';
import { Team } from './entities/Team';

@Injectable()
export class DbConfigService {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'pokemon',
      entities: [Profile, PokemonInstance, Team, PokemonPrototype],
      synchronize: true,
    };
  }
}
