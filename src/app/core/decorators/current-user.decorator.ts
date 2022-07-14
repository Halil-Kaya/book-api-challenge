import { UserEntity } from '@modules/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext): UserEntity => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);