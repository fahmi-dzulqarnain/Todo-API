import { createParamDecorator } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { UserEntity } from './models/user.entity'

export const GetUser = createParamDecorator(
    (_data, ctx: ExecutionContextHost): UserEntity => {
        const req = ctx.switchToHttp().getRequest()
        return req.user
    }
)
