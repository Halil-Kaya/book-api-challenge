# Book api Challange

> Hey merhaba ✋ bir challange olarak yaptigim bu projede amaç Google Books api'den gelen kitapları listelemek, kendi
> bookmark listenize eklemek,listelemek ve silmek

# Postman Linki

> https://documenter.getpostman.com/view/10504693/UzQvrjKe

#### Bağımlılıklar

- **NodeJs** (v16.13.2)
- **NPM** (v8.1.2)
- **Typescript** (4.1.2)
- **NestJS** (v8.1.1)
- **MySql** (v8)
- **Redis**

### Config Dosyaları

Geliştirme ve ürün ortamında kullanılan önemli dosyalar hakkında.

| **Dosya**               | **Açıklama**                                                                         |
|:------------------------|:-------------------------------------------------------------------------------------|
| `development.config.ts` | Geliştirme modunda kullanılacak database,redis vb. gibi ortam değişkenlerini içerir. |
| `production.config.ts`  | docker'ın içinde kullanılacak database,redis vb. ortam değişkenlerini içerir.                          |

Config dosyaları /src/config dizininde bulunmaktadır

#### Çalıştırma Modları

Projeyi ayağa kaldırma şekli hakkında.\

| **Komut** | **Açıklama**                                                          |
|:----------|:----------------------------------------------------------------------|
| `start:dev` | DEVELOPMENT modunda kalkar localdeki db ve redise bağlanır.           |
| `start:prod` | PRODUCTION modunda kalkar docker'ın içindeki db ve redise ve bağlanır |

### Notlar

Projeyi ayağa kaldırmanız için MySql ve Redis teknelojilerini indirmeniz gerekmektedir eğer bunlarla uğraşmak
istemiyorsanız
docker teknelojisi ile projeyi ayağa kaldırabilirsiniz.

## Development ortamında çalıştırmak

### MySql

| MYSQL_DATABASE| MYSQL_USERNAME | MYSQL_PASSWORD | MYSQL_HOST|
|----------------------|---------------|-------------------|---------------------|
| book_api | test    | 123456        | localhost         |

### Redis

| REDIS_URL| REDIS_PORT |REDIS_HOST  |
|----------------------|------------|-------------|
| redis://localhost:6379 | 6379       | localhost |

### Kurulum

```bash
$ npm install
```

### Projeyi ayağa kaldırma

```bash
#http://localhost:3031
$ npm run start:dev
```

## Docker ortamında çalıştırmak

### Projeyi ayağa kaldırma

```bash
#http://localhost:3031
$ docker-compose up
```

### Projeyi durdurma

```bash
$ docker-compose down
```
