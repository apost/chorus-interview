import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from 'fs';
import * as path from 'path';

export class SeedPokemon1741397873240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const filePath = path.join(__dirname, 'seeds', 'seed-pokemon.sql');
        const sql = fs.readFileSync(filePath, 'utf8');
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
