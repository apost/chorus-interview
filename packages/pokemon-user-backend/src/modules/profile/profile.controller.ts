import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from '../database/dto'

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async findAll(): Promise<ProfileDto[]> {
    return this.profileService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProfileDto> {
    return this.profileService.findOne(id);
  }

  @Post()
  async create(@Body() profileData: Partial<ProfileDto>): Promise<ProfileDto> {
    return this.profileService.create(profileData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() profileData: Partial<ProfileDto>): Promise<ProfileDto> {
    return this.profileService.update(id, profileData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.profileService.remove(id);
  }
}