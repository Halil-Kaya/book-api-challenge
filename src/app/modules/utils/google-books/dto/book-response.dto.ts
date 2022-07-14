export class BookResponseDto {
    id: string;
    volumeInfo: {
        title: string;
        subtitle: string;
        authors: string[];
        publishedDate: string;
        categories: string[];
        imageLinks: {
            'smallThumbnail': 'http://books.google.com/books/content?id=1jGAAAAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
            'thumbnail': 'http://books.google.com/books/content?id=1jGAAAAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
        },
        language: string;
        previewLink: string;
        infoLink: string;
        canonicalVolumeLink: string;
    };
}