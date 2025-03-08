import { Entity, PrimaryGeneratedColumn, JoinColumn, Unique, OneToOne, OneToMany } from "typeorm";
import { Profile } from "./Profile";
import { PokemonInstance } from "./PokemonInstance";

@Entity()
@Unique(["profile"])
export class Team {
    @PrimaryGeneratedColumn()
    team_id!: number;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile!: Profile;

    @OneToMany(() => PokemonInstance, (pokemonInstance) => pokemonInstance.team)
    pokemonInstances!: PokemonInstance[];
}