import { BaseError } from '@errors/base.error';
import { ErrorMessage } from '@errors/error.message';
import { ErrorStatus } from '@errors/error.status';
import { BooksResponseDto } from '@modules/book/google-books/dto/books-response.dto';
import { RedisCacheService } from '@modules/utils/redis-cache/service/redis-cache.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@source/config/environment';

@Injectable()
export class GoogleBooksService {
    private readonly logger = new Logger(GoogleBooksService.name);

    constructor(
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
            return response.data;
        } catch(err) {
            this.logger.error(err, 'GoogleBooksService:getBooks');
            throw new BaseError(ErrorStatus.BAD_REQUEST, ErrorMessage.UNEXPECTED);
        }
    }

    async getBook(bookId: string) {
        try {
            const response = await this.httpService.get(this.configService.get('GOOGLE_BOOKS_API').BASE_URL + '/' + bookId).toPromise();
            return response.data;
        } catch(err) {
            this.logger.error(err, 'GoogleBooksService:getBook');
            throw new BaseError(ErrorStatus.BAD_REQUEST, ErrorMessage.UNEXPECTED);
        }
    }
}