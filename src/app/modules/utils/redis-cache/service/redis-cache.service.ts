import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

/*
* kullanıcı booku bookmarkına eklerken id sini gönderecek bu id ye göre
* google-api den booku getirmem gerekiyor bunun için hep istek atmaktansa
* istek atılan bookları formatlayıp rediste 30 dakikalığına id:value şeklinde saklıyorum(her book rediste 1 tane tutuluyor)
* böylece kişi id ye göre bookmarkına ekleme yapmak istediğinde eğer cachede varsa ordan alıyorum yoksa api ye istek atıyorum
* redis kullanmamin sebebi bu
* */
@Injectable()
export class RedisCacheService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) {
    }

    async get<T>(key): Promise<T | undefined> {
        return this.cache.get<T>(key);
    }

    async set(key, value: any, ttlTime: number = 0): Promise<any> {
        return this.cache.set(key, value, { ttl: ttlTime });
    }
}