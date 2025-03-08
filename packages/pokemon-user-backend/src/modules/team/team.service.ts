import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../database/entities/Team';
import { Profile } from '../database/entities/Profile';
import { PokemonInstance } from '../database/entities/PokemonInstance';
import { PokemonInstanceDto, TeamDto} from '../database/dto';
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


  private toPokemonInstanceDto(pokemonInstance: Partial<PokemonInstance | null> ): PokemonInstanceDto {
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
      pokemonInstances: team.pokemonInstances.map(pokemonInstance => this.toPokemonInstanceDto(pokemonInstance)),
    };
  }

  async addPokemonToTeam(profileName: string, pokemonDisplayId: number, nickname: string | null): Promise<TeamDto> {
    const team = await this.getTeam(profileName);

    console.log('team', team);

    if (!team) {
        throw new NotFoundException(`Team for profile ${profileName} not found`);
    }
    
    if (team.pokemonInstances.length >= 6) {
        throw new BadRequestException('Team cannot have more than 6 Pokémon');
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
        nickname: nickname || pokemonPrototype.name,
        captured_at: new Date(),
    });
    
    console.log('pokemonInstance', pokemonInstance);

    if (!pokemonInstance) {
      throw new InternalServerErrorException(`Could not create Pokémon instance for team ${team.team_id}`);
    }

    const savedPokemonInstance = await this.pokemonInstanceRepository.save(pokemonInstance);

    team.pokemonInstances.push(this.toPokemonInstanceDto(pokemonInstance));
    const updatedTeam = await this.teamRepository.save(team);

    // Update the saved PokemonInstance with the updated team
    savedPokemonInstance.team = updatedTeam;
    await this.pokemonInstanceRepository.save(savedPokemonInstance);

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