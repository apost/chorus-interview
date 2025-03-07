import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { PokemonPrototype } from "./PokemonPrototype";
import { Team } from "./Team";

@Entity()

export class PokemonInstance {
    @PrimaryGeneratedColumn()
    instance_id!: number;

    @ManyToOne(() => PokemonPrototype)
    prototype!: PokemonPrototype;
    
    @ManyToOne(() => Team, team => team.pokemonInstances)
    team!: Team;

    @Column({ nullable: true })
    nickname?: string;

    @CreateDateColumn()
    captured_at!: Date;
}