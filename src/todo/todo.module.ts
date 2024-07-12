import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoEntity } from './models/todo.entity'
import { TodoController } from './controllers/todo.controller'
import { TodoService } from './services/todo.service'

@Module({
    imports: [ TypeOrmModule.forFeature([ TodoEntity ]) ],
    controllers: [ TodoController ],
    providers: [ TodoService ],
})
export class TodoModule {}
