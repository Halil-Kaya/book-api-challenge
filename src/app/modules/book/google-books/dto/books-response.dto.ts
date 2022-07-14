import { BookResponseDto } from '@modules/book/google-books/dto/book-response.dto';

export class BooksResponseDto {
    kind: string;
    totalItems: number;
    items: BookResponseDto[];
}