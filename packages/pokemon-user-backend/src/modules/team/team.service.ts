import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from '../database/entities/Team';
import { Profile } from '../database/entities/Profile';
import { PokemonInstance } from '../database/entities/PokemonInstance';
import { TeamDto, ProfileDto, PokemonInstanceDto, PokemonDto} from '../database/dto';
import { PokemonService } from '../pokemon/pokemon.service';
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

  async addPokemonToTeam(profileName: string, pokemonDisplayId: number, nickname: string | null): Promise<TeamDto> {
    const team = await this.getTeam(profileName);
    if (team.pokemonInstances.length >= 6) {
        throw new BadRequestException('Team cannot have more than 6 Pokémon');
    }

    if (!team) {
        throw new NotFoundException(`Team for profile ${profileName} not found`);
    }

    const pokemonPrototype = await this.pokemonPrototypeRepository.findOne({
        where: { display_id: pokemonDisplayId },
    });

    if (!pokemonPrototype) {
        throw new NotFoundException(`PokemonPrototype with display ID ${pokemonDisplayId} not found`);
    }

    const pokemonInstance = await this.pokemonInstanceRepository.create({
        prototype: pokemonPrototype,
        team: team,
        //nickname: pokemon.nickname || pokemonPrototype.name,
        captured_at: new Date(),
    });

    if (!pokemonInstance) {
      throw new InternalServerErrorException(`Could not create Pokémon instance for team ${team.team_id}`);
    }

    await this.pokemonInstanceRepository.save(pokemonInstance);

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