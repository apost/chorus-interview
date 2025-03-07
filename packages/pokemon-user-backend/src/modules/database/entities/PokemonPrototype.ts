import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PokemonPrototype {
    @PrimaryGeneratedColumn()
    prototype_id!: number;

    @Column({ unique: true })
    display_id!: number;

    @Column({ unique: true })
    name!: string;

}