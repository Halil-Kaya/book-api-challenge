import { checkResult, CheckType } from '@helpers/check.result';
import CreateUserDto from '@modules/auth/dto/create-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorStatus } from '@errors/error.status';
import { ErrorMessage } from '@errors/error.message';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
    }

    public async setRefreshTokenOfUser(userId: number, hashedRefreshToken: string): Promise<void> {
        await this.userRepository.update(userId, {
            currentHashedRefreshToken: hashedRefreshToken
        });
    }

    public async getUserWithPasswordByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({
            where: {
                email: email
            }
        });
    }

    public async findById(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id: id });
    }

    public async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    public async create(createUserDto: CreateUserDto): Promise<User> {
        await this.isUserAlreadyExistIfYesThrowError(createUserDto.email);
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }

    private async isUserAlreadyExistIfYesThrowError(email: string): Promise<void> {
        const isExist = await this.userRepository.findOneBy({
            email: email
        });
        checkResult(isExist,
            CheckType.IS_NOT_NULL_OR_UNDEFINED,
            ErrorStatus.BAD_REQUEST,
            ErrorMessage.THIS_EMAIL_HAS_ALREADY_EXIST);
    }
}