import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Environment } from '@source/config/environment';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '@source/app/core/filters/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
        origin: '*'
    });
    const config = app.get<ConfigService<Environment>>(ConfigService);
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.setGlobalPrefix(config.get<string>('URL_ROOT'));
    app.useGlobalPipes(new ValidationPipe({
        whitelist           : true,
        forbidNonWhitelisted: true
    }));
    await app.listen(config.get<number>('PORT'));
    return app;
}

bootstrap()
    .then(async (app) => {
        console.log(`App is running on: ${ await app.getUrl() }`);
    })
    .catch((error: Error) => console.error(error.message));
