import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    roleId?: string

    @Column('text')
    roleName?: string

    @Column('text')
    description?: string
}