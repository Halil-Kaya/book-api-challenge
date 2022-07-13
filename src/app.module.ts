import {Module} from '@nestjs/common';
import {AppMode} from "@source/config/app.mode";
import developmentConfiguration from "@source/config/development.config";
import productionConfiguration from "@source/config/production.config";
import {BaseError} from "@errors/base.error";
import {ErrorStatus} from "@errors/error.status";
import {ErrorMessage} from "@errors/error.message";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Environment} from "@source/config/environment";
import {AuthModule} from "@modules/auth/auth.module";
import {UserModule} from "@modules/user/user.module";

const ENV = process.env.MODE;
const configurationFile = (() => {
    switch (ENV) {
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
    imports: [
        ConfigModule.forRoot({
            load: [configurationFile],
            isGlobal: true
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService<Environment>) => ({
                uri: configService.get<string>("MONGO_CONNECTION_STRING"),
                useCreateIndex: true,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                connectionFactory: (connection) => {
                    return connection;
                }
            }),
            inject: [ConfigService]
        }),
        AuthModule,
        UserModule
    ],
    controllers: [],
})
export class AppModule {
}
