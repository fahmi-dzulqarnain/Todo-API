import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { SignUpDTO } from '../models/dto/sign-up.dto'
import { SignInDTO } from '../models/dto/sign-in.dto'
import { APIResponse } from 'src/common/types/response.type'
import { SignInResponse } from '../models/sign-in-response.model'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor (private service: AuthService) {}

    @Post('signUp')
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiResponse({ status: 201, description: 'User successfully created' })
    @ApiResponse({
        status: 400,
        description: 'Bad Request or Invalid input data',
    })
    @ApiBody({ type: SignUpDTO })
    signUp (@Body() dto: SignUpDTO) {
        return this.service.createUser(dto)
    }

    @Post('signIn')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiResponse({
        status: 200,
        description: 'User successfully signed in',
        type: SignInResponse,
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiBody({ type: SignInDTO })
    signIn (@Body() dto: SignInDTO): Promise<APIResponse<SignInResponse>> {
        return this.service.signIn(dto)
    }

    @Post('isTokenValid')
    @HttpCode(HttpStatus.OK)
    isTokenValid (
        @Body() dto: { token: string }
    ): Promise<APIResponse<boolean>> {
        return this.service.isTokenValid(dto.token)
    }
}
