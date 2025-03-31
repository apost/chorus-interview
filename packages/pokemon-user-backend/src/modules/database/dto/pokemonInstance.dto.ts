import { PokemonPrototype } from '../../database/entities/PokemonPrototype';
import { PokemonDto } from './pokemon.dto';

export class PokemonInstanceDto {
  id!: number;
  prototype!: PokemonDto;
  nickname!: string;
  captured_at!: Date;
  teamId!: number;
  spriteUrl?: string;
}