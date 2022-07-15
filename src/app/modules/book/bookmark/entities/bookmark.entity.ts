import { User } from '@modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Bookmark {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    volumeId: string;

    @Column({ type: 'text', nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    subtitle: string;

    @Column({ type: 'text', nullable: true })
    publisher: string;

    @Column({ type: 'text', nullable: true })
    authors: string;

    @Column({ type: 'text', nullable: true })
    categories: string;

    @Column({ type: 'text', nullable: true })
    previewLink: string;

    @Column({ type: 'text', nullable: true })
    infoLink: string;

    @Column({ type: 'text', nullable: true })
    smallThumbnail: string;

    @Column({ type: 'text', nullable: true })
    thumbnail: string;

    @Column({ type: 'text', nullable: true })
    canonicalVolumeLink: string;

    @Column({ type: 'text', nullable: true })
    publishedDate: string;

    @Column({ type: 'text', nullable: true })
    language: string;

    @Column({ type: 'number' })
    userId: number;

    @ManyToOne(() => User, user => user.bookmarks)
    user: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;
}