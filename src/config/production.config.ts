import { AppMode } from '@source/config/app.mode';

export default () => ({
    MODE                     : AppMode.PRODUCTION,
    URL_ROOT                 : '/api',
    PORT                     : process.env.PORT,
    JWT_SECRET               : 'ACTouSkiAbuSianUmELveydRIcKSMorOphiciontLopigAnulS',
    JWT_EXPIRES              : '30d',
    JWT_ALGORITHM            : 'HS256',
    JWT_REFRESH_TOKEN_SECRET : 'Zg1vricPuWQqX5cGHmoxkfl4SLy1817b*scU7G2IJ7^G9YMv8#',
    JWT_REFRESH_TOKEN_EXPIRES: '3600d',
    JWT_REFRESH_ALGORITHM    : 'HS256',
    REDIS                    : {
        URL: process.env.REDIS_URL,
    },
    MYSQL                    : {
        TYPE       : 'mysql',
        HOST       : process.env.MYSQL_HOST,
        USERNAME   : process.env.MYSQL_USERNAME,
        PASSWORD   : process.env.MYSQL_PASSWORD,
        DATABASE   : process.env.MYSQL_DATABASE,
        SYNCHRONIZE: process.env.MYSQL_SYNCHRONIZE
    },
    GOOGLE_BOOKS_API         : {
        BASE_URL: 'https://www.googleapis.com/books/v1/volumes'
    }
});