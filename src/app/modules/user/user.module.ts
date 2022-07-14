import { UserEntity } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/service/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports    : [
        TypeOrmModule.forFeature([ UserEntity ])
    ],
    controllers: [],
    providers  : [ UserService ],
    exports    : [ UserService ]
})
export class UserModule {
}
