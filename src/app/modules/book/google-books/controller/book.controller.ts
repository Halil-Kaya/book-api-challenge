import { Keywords } from '@decorators/keywords.decorator';
import { Paginate, Pagination } from '@decorators/pagination.decorator';
import { ResponseHelper } from '@helpers/response.helper';
import { GoogleBooksService } from '@modules/book/google-books/service/google-books.service';
import { Controller, Get, Req, Res, Param } from '@nestjs/common';

@Controller('book')
export class BookController {
    private controller = 'book';

    constructor(
        private readonly googleBooksService: GoogleBooksService
    ) {
    }

    @Get()
    async getBooks(@Req() request,
        @Res() response,
        @Keywords() keywords: string,
        @Paginate() pagination: Pagination) {
        const books = await this.googleBooksService.getBooks(keywords, pagination);
        response.json(ResponseHelper.set(
                books,
                {
                    controller: this.controller,
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }

    @Get(':bookId')
    async getBook(@Req() request,
        @Res() response,
        @Param('bookId') bookId: string) {
        const book = await this.googleBooksService.getBook(bookId);
        response.json(ResponseHelper.set(
                book,
                {
                    controller: this.controller,
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }
}
