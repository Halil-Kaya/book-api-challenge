import { Bookmark } from '@modules/bookmark/entities/bookmark.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkService {
    constructor(
        @InjectRepository(Bookmark) private bookmarkRepository: Repository<Bookmark>
    ) {
    }

}