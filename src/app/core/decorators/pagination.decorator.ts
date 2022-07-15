import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type Paginated<T> = {
    totalItemCount: number;
    items: T[];
};

export interface Pagination {
    offset?: number;
    page?: number; // Getirilecek sayfa
    limit?: number; // Getirilecek kayıt sayısı
    totalItemCount?: number; // Toplam kayıt sayısı.
    itemCount?: number; // Sayfa başı kayıt sayısı.
    count?: number; // Toplam sayfa sayısı.
    current?: number; // Aktif sayfa sayısı.
    hasNext?: boolean; // Sonraki sayfa bayrağı.
    next?: number; // Sonraki sayfa numarası.
    hasPrev?: boolean; // Önceki sayfa bayrağı.
    prev?: number; // Önceki sayfa numarası.
}

/*
* her controller'in icinde pagination bilgisini almaktansa bu islemi kolaylastirmak icin bunu deverator olarak ekliyorum
* boylece kodlar daha temiz oluyor
* daha fazla detay icin :-> https://docs.nestjs.com/custom-decorators
* */
export const Paginate = createParamDecorator(
    (data: string, ctx: ExecutionContext): Pagination => {
        const request = ctx.switchToHttp().getRequest();

        const page = request.body.page
            ? parseInt(request.body.page)
            : request.query.page
                ? parseInt(request.query.page)
                : 0;

        const limit = request.body.limit
            ? parseInt(request.body.limit)
            : request.query.limit
                ? parseInt(request.query.limit)
                : undefined;
        return {
            offset : page * limit < 0 ? 0 : page * limit,
            limit  : limit <= 0 || limit > 40 ? 40 : limit,
            page   : page,
            current: page,
            next   : page + 1,
            prev   : page - 1 >= 0 ? page - 1 : 0,
        };
    },
);
