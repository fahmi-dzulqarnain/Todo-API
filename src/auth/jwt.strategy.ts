import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './services/users.repository'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserEntity } from './models/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: 'T0dOl1sTs3cr3t',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate (payload: { email: string }) {
        const { email } = payload
        const user: UserEntity = await this.userRepository.findOneBy({
            email,
        })

        if (!user) {
            throw new UnauthorizedException('Token invalid')
        }

        return user
    }
}
