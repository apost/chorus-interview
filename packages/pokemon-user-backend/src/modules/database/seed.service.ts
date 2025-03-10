import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    Logger.log('🌱 Seeding database');
    const seedFiles = ['seed-pokemon.sql', 'seed-profiles.sql', 'seed-teams.sql'];
    for (const file of seedFiles) {
      const filePath = path.join(__dirname, '..', '..', '..', 'seeds', file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await this.dataSource.query(sql);
      Logger.log(`🌱 Seeded ${file}`);
    }
    Logger.log('🌱 Database seeded');
  }
}