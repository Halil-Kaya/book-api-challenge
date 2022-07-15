import { CurrentUser } from '@decorators/current-user.decorator';
import { JWTGuard } from '@guards/jwt.guard';
import { ResponseHelper } from '@helpers/response.helper';
import { BookmarkService } from '@modules/book/bookmark/service/bookmark.service';
import { User } from '@modules/user/entities/user.entity';
import { Controller, Get, Req, Res, Param, Post, UseGuards, Delete } from '@nestjs/common';

@Controller('bookmark')
export class BookmarkController {
    private controller = 'bookmark';

    constructor(
        private readonly bookmarkService: BookmarkService
    ) {
    }

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
