import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity('reservation')
export class Reservation {

    @PrimaryGeneratedColumn('uuid')
    reservationId?: string

    @ManyToOne(() => User)
    @JoinColumn({name: 'userId'})
    user?: User

    @CreateDateColumn()
    createdAt?: Date

    @Column('date')
    startDate?: Date

    @Column('date')
    endDate?: Date

    @Column('decimal')
    totalPrice?: number

    
}