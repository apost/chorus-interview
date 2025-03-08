import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TeamsService } from './team.service';
import { TeamDto } from '../database/dto'

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get(':profileName')
  async getTeam(@Param('profileName') profileName: string): Promise<TeamDto> {
    return this.teamsService.getTeam(profileName);
  }

  @Post(':profileId/pokemon')
  async addPokemonToTeam(
    @Param('profileId') profileId: number,
    @Body('pokemonInstanceId') pokemonInstanceId: number,
  ): Promise<TeamDto> {
    return this.teamsService.addPokemonToTeam(profileId, pokemonInstanceId);
  }
}