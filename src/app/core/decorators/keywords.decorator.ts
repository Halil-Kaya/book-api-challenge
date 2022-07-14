import { ErrorMessage } from '@errors/error.message';
import { ErrorStatus } from '@errors/error.status';
import { checkResult, CheckType } from '@helpers/check.result';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Keywords = createParamDecorator(
    (data: string, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        const keywords = request.query['keywords']?.trim();
        checkResult(keywords,
            CheckType.IS_NULL_OR_UNDEFINED,
            ErrorStatus.BAD_REQUEST,
            ErrorMessage.KEYWORDS_REQUIRED);
        return keywords;
    },
);