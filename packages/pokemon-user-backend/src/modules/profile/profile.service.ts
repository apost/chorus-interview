import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileDto } from '../database/dto';
import { Profile } from '../database/entities/Profile';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findAll(): Promise<ProfileDto[]> {
    return this.profileRepository.find();
  }

  async findOne(profile_id: number): Promise<ProfileDto> {
    const profile = await this.profileRepository.findOne({ where: { profile_id: profile_id } });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${profile_id} not found`);
    }
    return profile;
  }

  async create(profileData: Partial<ProfileDto>): Promise<ProfileDto> {
    const profile = this.profileRepository.create(profileData);
    return this.profileRepository.save(profile);
  }

  async update(profile_id: number, profileData: Partial<ProfileDto>): Promise<ProfileDto> {
    await this.profileRepository.update(profile_id, profileData);
    const updatedProfile = await this.profileRepository.findOne({ where: { profile_id } });
    if (!updatedProfile) {
      throw new NotFoundException(`Profile with ID ${profile_id} not found`);
    }
    return updatedProfile;
  }

  async remove(id: number): Promise<void> {
    const result = await this.profileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }
}