import { Bookmark } from '@modules/bookmark/entities/bookmark.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
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

    @OneToMany(() => Bookmark,bookmark => bookmark.user)
    bookmarks? : Bookmark[]
}

export interface SanitizedUser {
    id: number;
}