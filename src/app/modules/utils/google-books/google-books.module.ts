import { GoogleBooksController } from '@modules/utils/google-books/controller/google-books.controller';
import { GoogleBooksService } from '@modules/utils/google-books/service/google-books.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
    imports    : [ HttpModule ],
    controllers: [ GoogleBooksController ],
    providers  : [ GoogleBooksService ],
    exports    : [ GoogleBooksService ]
})
export class GoogleBooksModule {
}
