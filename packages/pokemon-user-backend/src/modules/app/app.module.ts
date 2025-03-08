import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonPrototype } from '@entities/PokemonPrototype';
import { DbModule } from '../database/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from '../pokemon/pokemon.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    DbModule,
    PokemonModule,
    ProfileModule,
    TypeOrmModule.forFeature([PokemonPrototype])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
