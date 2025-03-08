import { Module } from '@nestjs/common';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
