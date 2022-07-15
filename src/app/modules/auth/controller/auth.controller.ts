import { CurrentUser } from '@decorators/current-user.decorator';
import { JWTGuard } from '@guards/jwt.guard';
import { SignResponse } from '@helpers/jwt.token.helper';
import { ResponseHelper, DefaultResponse } from '@helpers/response.helper';
import CreateUserDto from '@modules/auth/dto/create-user.dto';
import LoginDto from '@modules/auth/dto/login.dto';
import { AuthService } from '@modules/auth/service/auth.service';
import { User } from '@modules/user/entities/user.entity';
import { Controller, Post, Req, Res, Body, UseGuards, Get } from '@nestjs/common';
import JwtRefreshGuard from '@guards/jwt-refresh.guard';
import * as $$ from 'lodash';

@Controller('auth')
export class AuthController {
    private controller = 'auth';

    constructor(
        private readonly authService: AuthService
    ) {
    }

    /*
    * Kullanicinin kendisini doner
    * */
    @Get('me')
    @UseGuards(JWTGuard)
    async getMe(
        @Req() request,
        @Res() response,
        @CurrentUser() currentUser: User) {
        response.json(ResponseHelper.set(
                $$.pick(currentUser, [ 'id', 'email' ]),
                {
                    controller: this.controller,
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }

    @Post('create')
    async create(
        @Req() request,
        @Res() response,
        @Body() createUserDto: CreateUserDto) {
        await this.authService.createUser(createUserDto);
        response.json(ResponseHelper.set(
                DefaultResponse.OK,
                {
                    controller: this.controller,
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }

    /*
    * email ve password bilgisi uyusuyorsa kisiye accessToken ve refreshToken döner
    * refreshToken'in yasam suresi accessToken'a kiyasla daha uzun. Kisi ona verilen refreshToken'ini
    * kullanarak yeni accessToken ve refreshToken alabilir
    * Boylece eger kisi uygulamayi aktif olarak kullaniyorsa accessToken'in suresi bittiginde tekrar email ve password ile
    * giris yapmak zorunda kalmiyacak
    * */
    @Post('login')
    async login(
        @Req() request,
        @Res() response,
        @Body() loginDto: LoginDto) {
        const tokens: SignResponse = await this.authService.login(loginDto);
        response.json(ResponseHelper.set(
                {
                    tokens: tokens
                },
                {
                    controller: this.controller,
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }

    /*
    * eger kisinin accessToken'in suresi bittiyse login'de verdigim refreshToken'ini kullanarak yeni
    * accessToken ve refreshToken alabilir
    * Tek yapmasi gereken refreshToken'i ile bu endpointe istek atmasi
    * */
    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    async refresh(@Req() request,
        @Res() response,
        @CurrentUser() currentUser) {
        const tokens = await this.authService.loginWithUserDocument(currentUser);
        await this.authService.setCurrentRefreshTokenForUser(request.user.id, tokens.refreshToken);
        response.json(ResponseHelper.set(
            {
                tokens: tokens
            },
            {
                controller: this.controller,
                params    : request.params,
                headers   : request.headers
            }));
    }

    /*
    * Kisiyi sistemden atar
    * */
    @Post('logout')
    @UseGuards(JWTGuard)
    async logout(
        @Req() request,
        @Res() response,
        @CurrentUser() currentUser) {
        await this.authService.logout(currentUser);
        response.json(ResponseHelper.set(
                DefaultResponse.OK,
                {
                    controller: this.controller,
                    params    : request.params,
                    headers   : request.headers
                }
            )
        );
    }
}
