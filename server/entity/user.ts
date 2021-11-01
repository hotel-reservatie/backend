import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Favorite } from "./favorite";
import { Review } from "./review";
import { Role } from "./role";

@Entity('user')
export class User {

    @PrimaryColumn('uuid')
    userId?: string

    @Column('text', {nullable: true})
    firstName?: string

    @Column('text', {nullable: true})
    lastName?: string

    @Column('text', {nullable: true})
    userName?: string

    @Column('text', {nullable: false})
    email?: string

    @Column('text', {nullable: true})
    phone?: string

    // @ManyToOne(() => Role)
    // @JoinColumn({name: 'roleId'})
    // role?: Role

    @Column('bool')
    admin?: boolean

    @OneToMany(() => Review, review => review.user)
    reviews?: Review[]

    @OneToMany(() => Favorite, favorite => favorite.user)
    favorites?: Favorite[]
}