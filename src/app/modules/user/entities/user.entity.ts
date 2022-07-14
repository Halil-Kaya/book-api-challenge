import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        default: ''
    })
    currentHashedRefreshToken: string;

    @Column({
        type   : 'boolean',
        default: false
    })
    isLoggin: boolean;
}

export interface SanitizedUser {
    id: number;
}