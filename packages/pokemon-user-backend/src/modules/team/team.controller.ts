import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { TeamsService } from './team.service';
import { PokemonDto, TeamDto } from '../database/dto'

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get(':profileName')
  async getTeam(@Param('profileName') profileName: string): Promise<TeamDto> {
    return this.teamsService.getTeam(profileName);
  }

  @Post(':profileName/capture')
  async addPokemonToTeam(
    @Param('profileName') profileName: string,
    @Body('pokemonDisplayId') pokemonDisplayId: number,
    @Body('nickname') nickname: string
  ): Promise<TeamDto> {
    return this.teamsService.capturePokemon(profileName, pokemonDisplayId, nickname);
  }

  @Delete(':profileName/release/:pokemonInstanceId')
    async removePokemonFromTeam(
        @Param('profileName') profileName: string,
        @Param('pokemonInstanceId') pokemonInstanceId: number
    ): Promise<TeamDto> {
        return this.teamsService.releasePokemon(profileName, pokemonInstanceId);
    }
}