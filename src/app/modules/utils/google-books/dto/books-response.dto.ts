import { BookResponseDto } from '@modules/utils/google-books/dto/book-response.dto';

export class BooksResponseDto {
    kind: string;
    totalItems: number;
    items: BookResponseDto[];
}