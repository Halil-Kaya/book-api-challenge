import { BaseError } from '@errors/base.error';
import { ErrorMessage } from '@errors/error.message';
import { ErrorStatus } from '@errors/error.status';
import { Bookmark } from '@modules/book/bookmark/entities/bookmark.entity';
import { BookResponseDto } from '@modules/book/google-books/dto/book-response.dto';
import { BooksResponseDto } from '@modules/book/google-books/dto/books-response.dto';
import { RedisStorageTimeEnum } from '@modules/utils/redis-cache/enums/redis-storage-time.enum';
import { RedisCacheService } from '@modules/utils/redis-cache/service/redis-cache.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Environment } from '@source/config/environment';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleBooksService {
    private readonly logger = new Logger(GoogleBooksService.name);

    constructor(
        @InjectRepository(Bookmark) private bookmarkRepository: Repository<Bookmark>,
        private readonly httpService: HttpService,
        private readonly redisCacheService: RedisCacheService,
        private readonly configService: ConfigService<Environment>
    ) {}

    async getBooks(keyword: string): Promise<BooksResponseDto> {
        try {
            const response = await this.httpService.get(this.configService.get('GOOGLE_BOOKS_API').BASE_URL, {
                params: {
                    q         : keyword,
                    maxResults: 20
                }
            }).toPromise();
            const booksResponseDto = response.data as BooksResponseDto;
            //Todo : kullanicinin bunu beklemesine gerek yok bunu event olarak ekle
            await this.setToCacheBooks(booksResponseDto.items);
            return booksResponseDto;
        } catch(err) {
            this.logger.error(err, 'GoogleBooksService:getBooks');
            throw new BaseError(ErrorStatus.BAD_REQUEST, ErrorMessage.UNEXPECTED);
        }
    }

    async getBook(bookId: string) {
        try {
            const response = await this.httpService.get(this.configService.get('GOOGLE_BOOKS_API').BASE_URL + '/' + bookId).toPromise();
            const bookResponseDto = response.data as BookResponseDto;
            //Todo : kullanicinin bunu beklemesine gerek yok bunu event olarak ekle
            await this.setToCacheBooks([ bookResponseDto ]);
        } catch(err) {
            this.logger.error(err, 'GoogleBooksService:getBook');
            throw new BaseError(ErrorStatus.BAD_REQUEST, ErrorMessage.UNEXPECTED);
        }
    }

    private async setToCacheBooks(bookResponseDtos: BookResponseDto[]): Promise<void> {
        for (const bookResponseDto of bookResponseDtos) {
            const bookmark = this.convertBookResponseToBookMarkObject(bookResponseDto);
            await this.setToCacheBook(bookmark);
        }
    }

    private async setToCacheBook(bookmark: Bookmark) {
        await this.redisCacheService.set(bookmark.volumeId, bookmark, RedisStorageTimeEnum.STORE_30_MINUTE);
    }

    private convertBookResponseToBookMarkObject(bookResponseDto: BookResponseDto): Bookmark {
        return this.bookmarkRepository.create({
            authors            : bookResponseDto.volumeInfo?.authors?.join('&'),
            language           : bookResponseDto.volumeInfo?.language,
            volumeId           : bookResponseDto.id,
            title              : bookResponseDto.volumeInfo?.title,
            subtitle           : bookResponseDto.volumeInfo?.subtitle,
            publisher          : bookResponseDto.volumeInfo?.publisher,
            categories         : bookResponseDto.volumeInfo?.categories?.join('&'),
            previewLink        : bookResponseDto.volumeInfo?.previewLink,
            infoLink           : bookResponseDto.volumeInfo?.infoLink,
            smallThumbnail     : bookResponseDto.volumeInfo?.imageLinks?.smallThumbnail,
            thumbnail          : bookResponseDto.volumeInfo?.imageLinks?.thumbnail,
            canonicalVolumeLink: bookResponseDto.volumeInfo?.canonicalVolumeLink,
            publishedDate      : bookResponseDto.volumeInfo?.publishedDate
        });
    }
}