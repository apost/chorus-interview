import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm";
import { Team } from "./Team";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    profile_id!: number;

    @Column({ unique: true })
    username!: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToOne(() => Team, team => team.profile)
    team!: Team;
}