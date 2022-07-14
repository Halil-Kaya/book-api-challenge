export class BookResponseDto {
    id: string;
    volumeInfo: {
        title: string;
        subtitle: string;
        authors: string[];
        publishedDate: string;
        categories: string[];
        imageLinks: {
            smallThumbnail: string;
            thumbnail: string;
        },
        language: string;
        previewLink: string;
        infoLink: string;
        canonicalVolumeLink: string;
    };
}