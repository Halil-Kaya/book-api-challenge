import { Pagination } from '@decorators/pagination.decorator';
import { ErrorMessage } from '@errors/error.message';
import { ErrorStatus } from '@errors/error.status';
import { checkResult, CheckType } from '@helpers/check.result';
import { Bookmark } from '@modules/book/bookmark/entities/bookmark.entity';
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

    public async getBookmarksOfUser(user: User, pagination: Pagination) {
        const query = {
            userId: user.id
        };
        const totalItemCount = await this.updatePagination(pagination, query);
        const results = await this.bookmarkRepository.find({
            where: query,
            skip : pagination.offset,
            take : pagination.limit
        });
        pagination.itemCount = results.length;
        return {
            totalItemCount: totalItemCount,
            items         : results,
        };
    }

    public async addBookmarkToUser(user: User, volumeId: string): Promise<Bookmark> {
        const existBookmark = await this.bookmarkRepository.findOneBy({
            volumeId: volumeId,
            userId  : user.id
        });
        if (existBookmark) {
            return existBookmark;
        }
        const bookmarkFromRedis = await this.redisCacheService.get<Bookmark>(volumeId);
        if (bookmarkFromRedis) {
            bookmarkFromRedis.userId = user.id;
            return await this.bookmarkRepository.save(bookmarkFromRedis);
        }
        const book = await this.googleBooksService.getBook(volumeId);
        const bookmarkObject = this.googleBooksService.convertBookResponseToBookMarkObject(book);
        bookmarkObject.userId = user.id;
        return await this.bookmarkRepository.save(bookmarkObject);
    }

    public async removeBookmarkFromUser(user: User, volumeId: string): Promise<Bookmark> {
        const targetBookmark = await this.bookmarkRepository.findOneBy({
            volumeId: volumeId,
            userId  : user.id
        });
        checkResult(targetBookmark,
            CheckType.IS_NULL_OR_UNDEFINED,
            ErrorStatus.BAD_REQUEST,
            ErrorMessage.BOOKMARK_NOT_FOUND);
        await this.bookmarkRepository.delete(targetBookmark.id);
        return targetBookmark;
    }

    private async updatePagination(
        pagination: Pagination,
        query?: any,
    ): Promise<number> {
        pagination.totalItemCount = await this.bookmarkRepository.countBy(query);
        pagination.offset = pagination?.offset ? pagination.offset : 0;
        pagination.count = pagination.totalItemCount == pagination.limit ? 0 : Math.abs(Math.floor(pagination.totalItemCount / pagination.limit - 1));
        pagination.hasNext = pagination.count > pagination.current;
        pagination.hasPrev = pagination.current > 0;
        return pagination.totalItemCount;
    }

}