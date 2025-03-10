import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { PokemonPrototype } from "./PokemonPrototype";
import { Team } from "./Team";

@Entity()

export class PokemonInstance {
    @PrimaryGeneratedColumn()
    instance_id!: number;

    @ManyToOne(() => PokemonPrototype)
    @JoinColumn({ name: 'prototype_id' })
    prototype!: PokemonPrototype;
    
    @ManyToOne(() => Team, (team) => team.pokemonInstances, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team!: Team;

    @Column({ nullable: true })
    nickname?: string;

    @CreateDateColumn()
    captured_at!: Date;
}