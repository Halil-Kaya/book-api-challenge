import { Bookmark } from '@modules/book/bookmark/entities/bookmark.entity';
import { BookResponseDto } from '@modules/book/google-books/dto/book-response.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkService {
    constructor(
        @InjectRepository(Bookmark) private bookmarkRepository: Repository<Bookmark>
    ) {
    }

    public convertBookResponsesToBookMarkObjects(bookResponsesDtos: BookResponseDto[]): Bookmark[] {
        const bookmarks = [];
        for (const bookResponseDto of bookResponsesDtos) {
            const bookmark = this.convertBookResponseToBookMarkObject(bookResponseDto);
            bookmarks.push(bookmark);
        }
        return bookmarks;
    }

    public convertBookResponseToBookMarkObject(bookResponseDto: BookResponseDto): Bookmark {
        return this.bookmarkRepository.create({
            authors            : bookResponseDto.volumeInfo.authors.join('&'),
            language           : bookResponseDto.volumeInfo.language,
            volumeId           : bookResponseDto.id,
            title              : bookResponseDto.volumeInfo.title,
            subtitle           : bookResponseDto.volumeInfo.subtitle,
            publisher          : bookResponseDto.volumeInfo.publisher,
            categories         : bookResponseDto.volumeInfo.categories.join('&'),
            previewLink        : bookResponseDto.volumeInfo.previewLink,
            infoLink           : bookResponseDto.volumeInfo.infoLink,
            smallThumbnail     : bookResponseDto.volumeInfo.imageLinks?.smallThumbnail,
            thumbnail          : bookResponseDto.volumeInfo.imageLinks?.thumbnail,
            canonicalVolumeLink: bookResponseDto.volumeInfo.canonicalVolumeLink,
            publishedDate      : bookResponseDto.volumeInfo.publishedDate
        });
    }

}