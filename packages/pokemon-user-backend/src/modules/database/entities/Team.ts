import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, OneToOne, OneToMany } from "typeorm";
import { Profile } from "./Profile";
import { PokemonInstance } from "./PokemonInstance";

@Entity()
@Unique(["profile"])
export class Team {
    @PrimaryGeneratedColumn()
    team_id!: number;

    @OneToOne(() => Profile, profile => profile.team)
    @JoinColumn({ name: "profile_id" })
    profile!: Profile;

    @OneToMany(() => PokemonInstance, pokemonInstance => pokemonInstance.team)
    pokemonInstances!: PokemonInstance[];
}