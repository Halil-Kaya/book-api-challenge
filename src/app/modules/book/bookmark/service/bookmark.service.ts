import { Bookmark } from '@modules/book/bookmark/entities/bookmark.entity';
import { BookResponseDto } from '@modules/book/google-books/dto/book-response.dto';
import { GoogleBooksService } from '@modules/book/google-books/service/google-books.service';
import { RedisCacheService } from '@modules/utils/redis-cache/service/redis-cache.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkService {
    constructor(
        @InjectRepository(Bookmark) private bookmarkRepository: Repository<Bookmark>,
        private readonly googleBooksService: GoogleBooksService,
        private readonly redisCacheService: RedisCacheService,
    ) {
    }


}