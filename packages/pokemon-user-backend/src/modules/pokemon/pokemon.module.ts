import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonPrototype } from '../database/entities/PokemonPrototype';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonPrototype])],
  controllers: [PokemonController],
  providers: [PokemonService]
})
export class PokemonModule {}
