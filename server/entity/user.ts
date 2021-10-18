import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Favorite } from "./favorite";
import { Review } from "./review";
import { Role } from "./role";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn('uuid')
    userId?: string

    @Column('text')
    firstName?: string

    @Column('text')
    lastName?: string

    @Column('text')
    userName?: string

    @Column('text')
    email?: string

    @Column('text')
    phone?: string

    @ManyToOne(() => Role)
    @JoinColumn({name: 'roleId'})
    role?: Role

    @OneToMany(() => Review, review => review.user)
    reviews?: Review[]

    @OneToMany(() => Favorite, favorite => favorite.user)
    favorites?: Favorite[]
}