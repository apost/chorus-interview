import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../database/entities/Team';
import { Profile } from '../database/entities/Profile';
import { PokemonInstance } from '../database/entities/PokemonInstance';
import { TeamDto, ProfileDto, PokemonInstanceDto} from '../database/dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(PokemonInstance)
    private readonly pokemonInstanceRepository: Repository<PokemonInstance>,
  ) {}

  async getTeam(profileName: string): Promise<TeamDto> {
    const profile = await this.profileRepository.findOne({ where: { username: profileName } });
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
      team_id: team.team_id,
      profile: {
        profile_id: profile.profile_id,
        username: profile.username,
        created_at: profile.created_at,
      },
      pokemonInstances: team.pokemonInstances.map(pokemonInstance => ({
        id: pokemonInstance.instance_id,
        prototype: pokemonInstance.prototype,
        nickname: pokemonInstance.nickname!,
        captured_at: pokemonInstance.captured_at,
        teamId: pokemonInstance.team.team_id,
      })),
    };
  }

  async addPokemonToTeam(profileId: number, pokemonInstanceId: number): Promise<TeamDto> {
    const team = await this.getTeam(profileId.toString());
    if (team.pokemonInstances.length >= 6) {
      throw new BadRequestException('Team cannot have more than 6 Pokémon');
    }
    const pokemonInstance = await this.pokemonInstanceRepository.findOne(
        { where: { instance_id: pokemonInstanceId } },
    );
    if (!pokemonInstance) {
      throw new NotFoundException(`PokemonInstance with ID ${pokemonInstanceId} not found`);
    }
    team.pokemonInstances.push({
        id: pokemonInstance.instance_id,
        prototype: pokemonInstance.prototype,
        nickname: pokemonInstance.nickname || pokemonInstance.prototype.name,
        captured_at: pokemonInstance.captured_at,
        teamId: team.team_id,
    });
    const updatedTeam = await this.teamRepository.save(team);

    return {
      team_id: updatedTeam.team_id,
      profile: {
        profile_id: updatedTeam.profile.profile_id,
        username: updatedTeam.profile.username,
        created_at: updatedTeam.profile.created_at,
      },
      pokemonInstances: updatedTeam.pokemonInstances.map(pokemonInstance => ({
        id: pokemonInstance.id,
        prototype: pokemonInstance.prototype,
        nickname: pokemonInstance.nickname,
        captured_at: pokemonInstance.captured_at,
        teamId: pokemonInstance.teamId,
      })),
    };
  }
}