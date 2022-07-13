import { UserDocument } from '@modules/user/model/user';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext): UserDocument => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);