import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './team.service';
import { TeamsController } from './team.controller';
import { Team } from '../database/entities/Team';
import { Profile } from '../database/entities/Profile';
import { PokemonInstance } from '../database/entities/PokemonInstance';
import { PokemonPrototype } from '../database/entities/PokemonPrototype';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Profile, PokemonInstance, PokemonPrototype])],
  providers: [TeamsService],
  controllers: [TeamsController],
})
export class TeamsModule {}