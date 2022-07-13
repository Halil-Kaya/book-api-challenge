import { Module } from '@nestjs/common';
import {AppMode} from "@source/config/app.mode";
import developmentConfiguration from "@source/config/development.config";
import productionConfiguration from "@source/config/production.config";
import {BaseError} from "@errors/base.error";
import {ErrorStatus} from "@errors/error.status";
import {ErrorMessage} from "@errors/error.message";
import {ConfigModule} from "@nestjs/config";

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
  imports: [
    ConfigModule.forRoot({
      load    : [ configurationFile ],
      isGlobal: true
    }),
  ],
  controllers: [],
})
export class AppModule {}
