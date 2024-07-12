import {
    ForbiddenException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './users.repository'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { SignUpDTO } from '../models/dto/sign-up.dto'
import { SignInDTO } from '../models/dto/sign-in.dto'
import { APIResponse } from 'src/common/types/response.type'
import { SignInResponse } from '../models/sign-in-response.model'

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(UserRepository)
        private repository: UserRepository,
        private jwtService: JwtService
    ) {}

    async createUser (dto: SignUpDTO) {
        const isUserExist = await this.repository.findOneBy({
            email: dto.email,
        })

        if (isUserExist) {
            throw new ForbiddenException(
                `Sorry, the email ${dto.email} is already taken`
            )
        }

        return await this.repository.createUser(dto)
    }

    async signIn (dto: SignInDTO): Promise<APIResponse<SignInResponse>> {
        const { email, password } = dto
        const user = await this.repository.findOneBy({ email })

        if (!user) {
            throw new NotFoundException(
                `There is no account with email ${email}`
            )
        }

        const isCanCompared = await bcrypt.compare(password, user.password)

        if (!isCanCompared) {
            throw new ForbiddenException(
                'Sorry, the password you entered is incorrect'
            )
        }

        const payload = { email }
        const accessToken = await this.jwtService.signAsync(payload)

        delete user.password

        return {
            message: 'Logged in successfully',
            statusCode: HttpStatus.OK,
            data: {
                accessToken,
                user,
            },
        }
    }

    async isTokenValid (token: string): Promise<APIResponse<boolean>> {
        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            await this.jwtService.verifyAsync(token)
        } catch {
            throw new UnauthorizedException()
        }

        return {
            message: 'Token is valid',
            statusCode: HttpStatus.OK,
            data: true,
        }
    }
}
