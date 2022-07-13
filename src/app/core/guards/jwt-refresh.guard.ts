import {ExecutionContext, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {BaseError} from "@errors/base.error";
import {ErrorStatus} from "@errors/error.status";
import {ErrorMessage} from "@errors/error.message";
import {StrategyType} from "@source/app/core/strategies/strategy.enum";
import {AuthService} from "@modules/auth/service/auth.service";

@Injectable()
export default class JwtRefreshGuard extends AuthGuard(StrategyType.JWT_REFRESH) {
    constructor(readonly authService: AuthService) {
        super();
        if (!this.authService) {
            throw new BaseError(ErrorStatus.INTERNAL_SERVER_ERROR,
                ErrorMessage.JWT_USER_GUARD_CAN_NOT_BE_INSTANTIATED)
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const jwtActivation = await super.canActivate(context)
        if (!jwtActivation) {
            return false
        }
        return true
    }
}