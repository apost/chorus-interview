import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProfileDto } from '../database/dto';
import { Profile } from '../database/entities/Profile';
import { Team } from '../database/entities/Team';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
    ) { }

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

    async create(createProfileDto: Partial<ProfileDto>): Promise<ProfileDto> {
        const { username } = createProfileDto;

        if (!username) {
            throw new BadRequestException('Username is required.');
        }

        // Check if a profile with the same username (case-insensitive) already exists
        const existingProfile = await this.profileRepository
            .findOne({
                where: { username: ILike(username) },
            })
            .catch((error) => {
                throw new InternalServerErrorException(`Failed to get profile with name ${username}: ${error}`);
            });

        if (existingProfile) {
            throw new BadRequestException('Profile with this username already exists.');
        }

        // Create the new profile
        const profile = this.profileRepository.create({ username });
        const savedProfile = await this.profileRepository.save(profile);

        // Create a new team for the new profile
        const team = this.teamRepository.create({ profile: savedProfile });
        await this.teamRepository.save(team);

        return savedProfile;
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