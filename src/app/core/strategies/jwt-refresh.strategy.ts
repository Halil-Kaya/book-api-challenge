import { ConfigService } from '@nestjs/config';
import { Environment } from '@source/config/environment';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import {StrategyType} from "@source/app/core/strategies/strategy.enum";
import {AuthService} from "@modules/auth/service/auth.service";

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(Strategy, StrategyType.JWT_REFRESH) {
    constructor(
        private readonly configService: ConfigService<Environment>,
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest   : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey      : configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: any) {
        const refreshToken = request.headers['authorization'].split(' ')[1];
        return this.authService.getUserIfRefreshTokenMatches(refreshToken, payload._id);
    }
}