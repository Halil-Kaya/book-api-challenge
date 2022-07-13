import { checkResult, CheckType } from '@helpers/check.result';
import CreateUserDto from '@modules/auth/dto/create-user.dto';
import { User, UserDocument } from '@modules/user/model/user';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorStatus } from '@errors/error.status';
import { ErrorMessage } from '@errors/error.message';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {
    }

    public async setRefreshTokenOfUser(userId: string | Types.ObjectId, hashedRefreshToken: string): Promise<void> {
        await this.userModel.updateOne({ _id: userId }, {
            currentHashedRefreshToken: hashedRefreshToken
        });
    }

    public async getUserWithPasswordByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({
            email: email
        }).select('+password');
    }

    public async findById(_id: Types.ObjectId | string): Promise<UserDocument> {
        return this.userModel.findById(_id);
    }

    public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        await this.isUserAlreadyExistIfYesThrowError(createUserDto.email);
        return this.userModel.create(createUserDto);
    }

    private async isUserAlreadyExistIfYesThrowError(email: string): Promise<void> {
        const isExist = await this.userModel.exists({ email: email });
        checkResult(isExist,
            CheckType.IS_TRUE,
            ErrorStatus.BAD_REQUEST,
            ErrorMessage.THIS_EMAIL_HAS_ALREADY_EXIST);
    }
}