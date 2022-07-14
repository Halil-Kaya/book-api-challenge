import { Bookmark } from '@modules/book/bookmark/entities/bookmark.entity';
import { BookmarkService } from '@modules/book/bookmark/service/bookmark.service';
import { GoogleBooksController } from '@modules/book/google-books/controller/google-books.controller';
import { GoogleBooksService } from '@modules/book/google-books/service/google-books.service';
import { RedisCacheModule } from '@modules/utils/redis-cache/redis-cache.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports    : [
        TypeOrmModule.forFeature([ Bookmark ]),
        HttpModule,
        RedisCacheModule
    ],
    controllers: [ GoogleBooksController ],
    providers  : [ BookmarkService, GoogleBooksService ],
    exports    : [ BookmarkService, GoogleBooksService ]
})
export class BookModule {
}
