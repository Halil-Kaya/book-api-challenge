import { BookModule } from '@modules/book/book.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppMode } from '@source/config/app.mode';
import developmentConfiguration from '@source/config/development.config';
import productionConfiguration from '@source/config/production.config';
import { BaseError } from '@errors/base.error';
import { ErrorStatus } from '@errors/error.status';
import { ErrorMessage } from '@errors/error.message';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment } from '@source/config/environment';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@source/app/core/filters/all-exceptions.filter';
import { LoggerMiddleware } from '@middlewares/logger.middleware';

/*
* calistirma seklime gore config dosyasini seciyor
* eger 'start:dev' ile calisirsa 'developmentConfiguration'
* eger 'start:prod' ile calisirsa 'productionConfiguration'
* config dosyasini secer
* */
const ENV = process.env.MODE;
const configurationFile = (() => {
    switch(ENV) {
        case AppMode.DEVELOPMENT:
            return developmentConfiguration;
        case AppMode.PRODUCTION:
            return productionConfiguration;
        default:
            throw new BaseError(
                ErrorStatus.SERVICE_UNAVAILABLE,
                ErrorMessage.INVALID_APP_MODE
            );
    }
})();

@Module({
    imports    : [
        ConfigModule.forRoot({
            load    : [ configurationFile ],
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            imports   : [ ConfigModule ],
            useFactory: (configService: ConfigService<Environment>) => ({
                type       : configService.get('MYSQL').TYPE,
                host       : configService.get('MYSQL').HOST,
                username   : configService.get('MYSQL').USERNAME,
                password   : configService.get('MYSQL').PASSWORD,
                database   : configService.get('MYSQL').DATABASE,
                entities   : [ 'dist/**/*.entity{.ts,.js}' ],
                synchronize: configService.get('MYSQL').SYNCHRONIZE
            }),
            inject    : [ ConfigService ]
        }),
        EventEmitterModule.forRoot(),
        AuthModule,
        UserModule,
        BookModule
    ],
    controllers: [],
    providers  : [
        {
            provide : APP_FILTER,
            useClass: AllExceptionsFilter,
        }
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(LoggerMiddleware)//logger middleware imi ekledigim yer
            .forRoutes('*');
    }
}