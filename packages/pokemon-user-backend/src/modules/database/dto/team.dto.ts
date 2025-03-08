import { PokemonInstance } from '../../database/entities/PokemonInstance';
import { PokemonInstanceDto } from './pokemonInstance.dto';
import { ProfileDto } from './profile.dto';

export class TeamDto {
  team_id!: number;
  profile!: ProfileDto;
  pokemonInstances!: PokemonInstanceDto[];
}