import { Controller, Get, Param, Post, Body } from '@nestjs/common';
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
    return this.teamsService.addPokemonToTeam(profileName, pokemonDisplayId, nickname);
  }
}