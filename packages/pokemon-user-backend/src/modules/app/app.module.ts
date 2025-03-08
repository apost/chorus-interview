import { Module } from '@nestjs/common';
import { DbModule } from '../database/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from '../pokemon/pokemon.module';
import { ProfileModule } from '../profile/profile.module';
import { TeamsModule } from '../team/team.module';

@Module({
  imports: [
    DbModule,
    PokemonModule,
    ProfileModule,
    TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
