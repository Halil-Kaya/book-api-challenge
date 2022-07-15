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

    /*
    * Atilan keywords e gore Google books Api'den kitaplari pagination bir sekilde getirir
    * */
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

    /*
    * parametre olarak gonderilen volumeId ye gore google books api den kitabi getirir
    * */
    @Get(':volumeId')
    async getBook(@Req() request,
        @Res() response,
        @Param('volumeId') volumeId: string) {
        const book = await this.googleBooksService.getBook(volumeId);
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
