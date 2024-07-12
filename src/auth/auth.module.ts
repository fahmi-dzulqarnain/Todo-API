import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './models/user.entity'
import { UserRepository } from './services/users.repository'
import { JwtStrategy } from './jwt.strategy'

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'T0dOl1sTs3cr3t',
            signOptions: {
                expiresIn: '100m',
            },
        }),
        TypeOrmModule.forFeature([ UserEntity ]),
    ],
    controllers: [ AuthController ],
    providers: [ AuthService, UserRepository, JwtStrategy ],
    exports: [ JwtStrategy, PassportModule, UserRepository ],
})
export class AuthModule {}
