import { Bookmark } from '@modules/book/bookmark/entities/bookmark.entity';
import { BookResponseDto } from '@modules/book/google-books/dto/book-response.dto';
import { GoogleBooksService } from '@modules/book/google-books/service/google-books.service';
import { User } from '@modules/user/entities/user.entity';
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

    public async addBookmarkToUser(user: User, bookId: string): Promise<Bookmark> {
        const existBookmark = await this.bookmarkRepository.findOneBy({
            volumeId: bookId,
            userId  : user.id
        });
        if (existBookmark) {
            return existBookmark;
        }
        const bookmarkFromRedis = await this.redisCacheService.get<Bookmark>(bookId);
        if (bookmarkFromRedis) {
            bookmarkFromRedis.userId = user.id;
            return await this.bookmarkRepository.save(bookmarkFromRedis);
        }
        const book = await this.googleBooksService.getBook(bookId);
        const bookmarkObject = this.googleBooksService.convertBookResponseToBookMarkObject(book);
        bookmarkObject.userId = user.id;
        return await this.bookmarkRepository.save(bookmarkObject);
    }

}