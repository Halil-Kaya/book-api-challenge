import { User } from '@modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Bookmark {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    volumeId: string;

    @Column()
    title: string;

    @Column()
    subtitle: string;

    @Column()
    publisher: string;

    @Column()
    authors: string;

    @Column()
    categories: string;

    @Column()
    previewLink: string;

    @Column()
    infoLink: string;

    @Column()
    smallThumbnail: string;

    @Column()
    thumbnail: string;

    @Column()
    canonicalVolumeLink: string;

    @Column()
    publishedDate: string;

    @Column()
    language: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.bookmarks)
    user: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;
}