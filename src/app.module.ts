import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { env } from 'process'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { TodoModule } from './todo/todo.module'
import { UserEntity } from './auth/models/user.entity'
import { TodoEntity } from './todo/models/todo.entity'
import { TransformInterceptor } from './common/transform.interceptor'
import { SwaggerModule } from '@nestjs/swagger'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SwaggerModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: env.DB_HOST,
            port: parseInt(<string>env.DB_PORT),
            username: env.DB_USER,
            password: env.DB_PASS,
            database: env.DB_NAME,
            entities: [ UserEntity, TodoEntity ],
            migrationsRun: true,
            autoLoadEntities: true,
            synchronize: false,
            dropSchema: false,
            logging: false,
        }),
        AuthModule,
        TodoModule,
    ],
    controllers: [ AppController ],
    providers: [ AppService, TransformInterceptor ],
})
export class AppModule {}
