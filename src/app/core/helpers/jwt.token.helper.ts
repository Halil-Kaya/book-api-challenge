import { User } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@source/config/environment';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface SignResponse {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class JWTTokenHelper {
    private readonly jwtOptions: JwtSignOptions;
    private readonly jwtRefreshTokenOptions: JwtSignOptions;

    constructor(
        private readonly configService: ConfigService<Environment>,
        private readonly jwtService: JwtService,
    ) {
        this.jwtOptions = {
            secret   : configService.get<string>('JWT_SECRET'),
            expiresIn: configService.get<string>('JWT_EXPIRES'),
            algorithm: configService.get('JWT_ALGORITHM')
        };
        this.jwtRefreshTokenOptions = {
            secret   : configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
            algorithm: configService.get('JWT_REFRESH_ALGORITHM')
        };
    }

    private getTokenForUser(payload: any): SignResponse {
        const accessToken = this.jwtService.sign(payload, this.jwtOptions);
        const refreshToken = this.jwtService
            .sign(payload, this.jwtRefreshTokenOptions);
        return {
            accessToken : accessToken,
            refreshToken: refreshToken
        };
    }

    public signUser(
        user: User
    ): SignResponse {
        return this.getTokenForUser({
            id: user.id
        });
    }
}
