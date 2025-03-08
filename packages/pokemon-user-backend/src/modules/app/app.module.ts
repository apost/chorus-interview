import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonPrototype } from '@entities/PokemonPrototype';
import { DbModule } from '../database/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonController } from '../pokemon/pokemon.controller';
import { ProfileController } from '../profile/profile.controller';
import { PokemonService } from '../pokemon/pokemon.service';
import { ProfileService } from '../profile/profile.service';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([PokemonPrototype])
  ],
  controllers: [AppController, PokemonController, ProfileController],
  providers: [AppService, PokemonService, ProfileService],
})
export class AppModule {}
