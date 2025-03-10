import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import { Repository } from 'typeorm';
import { Team } from '../database/entities/Team';
import { Profile } from '../database/entities/Profile';
import { PokemonInstance } from '../database/entities/PokemonInstance';
import { PokemonInstanceDto, TeamDto } from '../database/dto';
import { PokemonPrototype } from '../database/entities/PokemonPrototype';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(PokemonInstance)
        private readonly pokemonInstanceRepository: Repository<PokemonInstance>,
        @InjectRepository(PokemonPrototype)
        private readonly pokemonPrototypeRepository: Repository<PokemonPrototype>,
    ) { }


    private toPokemonInstanceDto(pokemonInstance: Partial<PokemonInstance | null>): PokemonInstanceDto {
        return {
            id: pokemonInstance?.instance_id || -1,
            prototype: {
                display_id: pokemonInstance?.prototype?.display_id || -1,
                name: pokemonInstance?.prototype?.name || 'MissingNo.',
                prototype_id: pokemonInstance?.prototype?.prototype_id || -1,
            },
            nickname: pokemonInstance?.nickname! || 'MissingNo.',
            captured_at: pokemonInstance?.captured_at || new Date(),
            teamId: pokemonInstance?.team?.team_id || -1,
        };
    }

    private async findTeamByProfileName(profileName: string): Promise<{ team: Team; profile: Profile }> {
        const profile = await this.profileRepository
            .findOne({
                where: { username: ILike(profileName) },
            })
            .catch((error) => {
                throw new InternalServerErrorException(`Failed to get profile with name ${profileName}: ${error}`);
            });

        if (!profile) {
            throw new NotFoundException(`Profile with name ${profileName} not found`);
        }

        const team = await this.teamRepository.findOne({
            where: { profile: { profile_id: profile.profile_id } },
            relations: ['pokemonInstances', 'pokemonInstances.prototype'],
        });

        if (!team) {
            throw new NotFoundException(`Team for profile ${profileName} not found`);
        }

        return {
            team: team,
            profile: profile,
        }
    }

    async getTeam(profileName: string): Promise<TeamDto> {
        const { team, profile } = await this.findTeamByProfileName(profileName);

        if (!team) {
            throw new NotFoundException(`Team for profile ${profileName} not found`);
        }

        return {
            team_id: team.team_id,
            profile: {
                profile_id: profile.profile_id,
                username: profile.username,
                created_at: profile.created_at,
            },
            pokemonInstances: team.pokemonInstances.map(pokemonInstance => this.toPokemonInstanceDto(pokemonInstance)),
        };
    }

    async addPokemonToTeam(profileName: string, pokemonDisplayId: number, nickname: string | null): Promise<TeamDto> {
        const { team, profile } = await this.findTeamByProfileName(profileName);

        console.log('team', team);

        if (!team) {
            throw new NotFoundException(`Team for profile ${profileName} not found`);
        }

        if (team.pokemonInstances.length >= 6) {
            throw new BadRequestException('Team cannot have more than 6 Pokémon');
        }

        // Fetch PokemonPrototype directly
        const pokemonPrototype = await this.pokemonPrototypeRepository.findOne({
            where: { display_id: pokemonDisplayId },
        });

        console.log('pokemonPrototype', pokemonPrototype);

        if (!pokemonPrototype) {
            throw new NotFoundException(`PokemonPrototype with display ID ${pokemonDisplayId} not found`);
        }

        // Create and associate Pokémon in a single step
        const pokemonInstance = this.pokemonInstanceRepository.create({
            prototype: pokemonPrototype,
            team, // Directly associate with the team
            nickname: nickname || pokemonPrototype.name,
            captured_at: new Date(),
        });

        // Save the Pokémon instance
        const savedPokemonInstance = await this.pokemonInstanceRepository.insert(pokemonInstance);


        console.log('pokemonInstance', pokemonInstance);

        // Reload the team to ensure the relationship is updated
        const updatedTeam = await this.teamRepository.findOne({
            where: { team_id: team.team_id },
            relations: ['pokemonInstances', 'pokemonInstances.prototype', 'profile'],
        });

        if (!updatedTeam) {
            throw new InternalServerErrorException(`Could not fetch updated team ${team.team_id}`);
        }
        return {
            team_id: team.team_id,
            profile: {
                profile_id: profile.profile_id,
                username: profile.username,
                created_at: profile.created_at,
            },
            pokemonInstances: team.pokemonInstances.map(this.toPokemonInstanceDto),
        };
    }

}