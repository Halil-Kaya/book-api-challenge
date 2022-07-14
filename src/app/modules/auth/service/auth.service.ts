import { ErrorMessage } from '@errors/error.message';
import { ErrorStatus } from '@errors/error.status';
import { checkResult, CheckType } from '@helpers/check.result';
import { JWTTokenHelper, SignResponse } from '@helpers/jwt.token.helper';
import LoginDto from '@modules/auth/dto/login.dto';
import { User, SanitizedUser } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/service/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Environment } from '@source/config/environment';
import * as bcrypt from 'bcrypt';
import * as shajs from 'sha.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService<Environment>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly tokenHelper: JWTTokenHelper
    ) {
    }

    public async login(loginDto: LoginDto): Promise<SignResponse> {
        const user: User = await this.checkAuthAndGetUser(loginDto);
        const tokens: SignResponse = this.tokenHelper.signUser(user);
        user.isLoggin = true;
        user.currentHashedRefreshToken = await AuthService.hashRefreshToken(tokens.refreshToken);
        await this.userService.save(user);
        return tokens;
    }

    public async loginWithUserDocument(user: User): Promise<SignResponse> {
        const tokens: SignResponse = this.tokenHelper.signUser(user);
        user.isLoggin = true;
        user.currentHashedRefreshToken = await AuthService.hashRefreshToken(tokens.refreshToken);
        await this.userService.save(user);
        return tokens;
    }

    public async logout(user: User): Promise<void> {
        user.isLoggin = false;
        user.currentHashedRefreshToken = '';
        await this.userService.save(user);
    }

    public async createUser(createUserDto): Promise<void> {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
        const createdUser: User = await this.userService.create(createUserDto);
        checkResult(createdUser,
            CheckType.IS_NULL_OR_UNDEFINED,
            ErrorStatus.BAD_REQUEST,
            ErrorMessage.UNEXPECTED);
    }

    public async findUserFromSanitizedUser(sanitizedUser: SanitizedUser) {
        return this.userService.findById(sanitizedUser.id);
    }

    private async checkAuthAndGetUser(loginDto: LoginDto): Promise<User> {
        const user: User = await this.userService.getUserWithPasswordByEmail(loginDto.email);
        checkResult(user, CheckType.IS_NULL_OR_UNDEFINED, ErrorStatus.BAD_REQUEST, ErrorMessage.INVALID_CREDENTIALS);
        const isPasswordMatch: boolean = await AuthService.checkPasswordMatch(loginDto.password, user.password);
        checkResult(isPasswordMatch, CheckType.IS_FALSE, ErrorStatus.BAD_REQUEST, ErrorMessage.INVALID_CREDENTIALS);
        return user;
    }

    private static checkPasswordMatch(password, realPassword): Promise<boolean> {
        return bcrypt.compare(password, realPassword);
    }

    //~~~~~Refresh token section start
    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const encryptedRefreshToken = shajs('sha256').update(refreshToken).digest('hex');
        const user = await this.userService.findById(userId);
        const isRefreshTokenMatching = await bcrypt.compare(
            encryptedRefreshToken,
            user.currentHashedRefreshToken,
        );
        if (isRefreshTokenMatching) {
            return user;
        }
    }

    async setCurrentRefreshTokenForUser(userId: number, refreshToken: string) {
        const currentHashedRefreshToken = await AuthService.hashRefreshToken(refreshToken);
        await this.userService.setRefreshTokenOfUser(userId, currentHashedRefreshToken);
    }

    private static async hashRefreshToken(refreshToken: string): Promise<string> {
        const encryptedRefreshToken = shajs('sha256').update(refreshToken).digest('hex');
        return await bcrypt.hash(encryptedRefreshToken, 10);
    }

    //~~~~~Refresh token section end

}