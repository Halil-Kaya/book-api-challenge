import { GoogleBooksController } from '@modules/utils/google-books/controller/google-books.controller';
import { GoogleBooksService } from '@modules/utils/google-books/service/google-books.service';
import { RedisCacheModule } from '@modules/utils/redis-cache/redis-cache.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
    imports    : [ HttpModule, RedisCacheModule ],
    controllers: [ GoogleBooksController ],
    providers  : [ GoogleBooksService ],
    exports    : [ GoogleBooksService ]
})
export class GoogleBooksModule {
}
