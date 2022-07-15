import { CurrentUser } from '@decorators/current-user.decorator';
import { JWTGuard } from '@guards/jwt.guard';
import { ResponseHelper } from '@helpers/response.helper';
import { BookmarkService } from '@modules/book/bookmark/service/bookmark.service';
import { User } from '@modules/user/entities/user.entity';
import { Controller, Get, Req, Res, Param, Post, UseGuards } from '@nestjs/common';

@Controller('bookmark')
export class BookmarkController {
    private controller = 'bookmark';

    constructor(
        private readonly bookmarkService: BookmarkService
    ) {
    }

    @Post(':bookId')
    @UseGuards(JWTGuard)
    async addBookmarkToUser(@Req() request,
        @Res() response,
        @Param('bookId') bookId: string,
        @CurrentUser() currentUser: User) {
        const bookmark = await this.bookmarkService.addBookmarkToUser(currentUser, bookId);
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
