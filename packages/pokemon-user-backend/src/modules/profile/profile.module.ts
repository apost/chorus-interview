import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../database/entities/Profile';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Team } from '../database/entities/Team';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Team])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}