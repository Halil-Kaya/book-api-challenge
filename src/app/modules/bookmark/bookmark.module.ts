import { Bookmark } from '@modules/bookmark/entities/bookmark.entity';
import { BookmarkService } from '@modules/bookmark/service/bookmark.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports    : [
        TypeOrmModule.forFeature([ Bookmark ])
    ],
    controllers: [],
    providers  : [ BookmarkService ],
    exports    : [ BookmarkService ]
})
export class BookmarkModule {
}
