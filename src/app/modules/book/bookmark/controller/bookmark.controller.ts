import { CurrentUser } from '@decorators/current-user.decorator';
import { Paginate, Pagination } from '@decorators/pagination.decorator';
import { JWTGuard } from '@guards/jwt.guard';
import { ResponseHelper } from '@helpers/response.helper';
import { BookmarkService } from '@modules/book/bookmark/service/bookmark.service';
import { User } from '@modules/user/entities/user.entity';
import { Controller, Req, Res, Param, Post, UseGuards, Delete, Get } from '@nestjs/common';

@Controller('bookmark')
export class BookmarkController {
    private controller = 'bookmark';

    constructor(
        private readonly bookmarkService: BookmarkService
    ) {
    }

    /*
    * Kullanicinin bookmark'larini sayfali bir sekilde getirir
    * */
    @Get()
    @UseGuards(JWTGuard)
    async getBookmarksOfUser(@Req() request,
        @Res() response,
        @CurrentUser() currentUser: User,
        @Paginate() pagination: Pagination) {
        const paginatedResult = await this.bookmarkService.getBookmarksOfUser(currentUser, pagination);
        response.json(ResponseHelper.set(
                paginatedResult,
                {
                    controller: this.controller,
                    pagination: {
                        total: paginatedResult.totalItemCount,
                        ...pagination,
                    },
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }

    /*
    * parametre olarak gonderilen volumeId ye gore book'u bulup bunu kullaniciya ekler
    * (bu ekleme isleminde once cache bakar eger orda yoksa api'ye istek atar)
    * */
    @Post(':volumeId')
    @UseGuards(JWTGuard)
    async addBookmarkToUser(@Req() request,
        @Res() response,
        @Param('volumeId') volumeId: string,
        @CurrentUser() currentUser: User) {
        const bookmark = await this.bookmarkService.addBookmarkToUser(currentUser, volumeId);
        response.json(ResponseHelper.set(
                bookmark,
                {
                    controller: this.controller,
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }

    /*
    * parametre olarak gonderilen volumeId ye gore kullanicinin bookmark listesinden siler
    * */
    @Delete(':volumeId')
    @UseGuards(JWTGuard)
    async removeBookmarkFromUser(@Req() request,
        @Res() response,
        @Param('volumeId') volumeId: string,
        @CurrentUser() currentUser: User) {
        const bookmark = await this.bookmarkService.removeBookmarkFromUser(currentUser, volumeId);
        response.json(ResponseHelper.set(
                bookmark,
                {
                    controller: this.controller,
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }
}
