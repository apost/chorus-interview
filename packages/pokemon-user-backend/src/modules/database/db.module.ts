import { Module } from '@nestjs/common';
import { DbConfigService } from './db-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonPrototype } from './entities/PokemonPrototype';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DbConfigService,
    }),
    TypeOrmModule.forFeature([PokemonPrototype]),
  ],
})
export class DbModule {}
