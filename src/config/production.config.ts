import { AppMode } from "@source/config/app.mode";

export default () => ({
  MODE                     : AppMode.PRODUCTION,
  URL_ROOT                 : "/api",
  PORT                     : "3032",
  MONGO_CONNECTION_STRING  : process.env.DB_URL,
  JWT_SECRET               : "ACTouSkiAbuSianUmELveydRIcKSMorOphiciontLopigAnulS",
  JWT_EXPIRES              : "30d",
  JWT_ALGORITHM            : "HS256",
  JWT_REFRESH_TOKEN_SECRET : "Zg1vricPuWQqX5cGHmoxkfl4SLy1817b*scU7G2IJ7^G9YMv8#",
  JWT_REFRESH_TOKEN_EXPIRES: "3600d",
  JWT_REFRESH_ALGORITHM    : "HS256",
  REDIS                    : {
    URL : process.env.REDIS_URL,
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT
  }
});