import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TodoService } from '../services/todo.service'
import { TodoDTO } from '../models/todo.dto'
import { GetUser } from '../../auth/get-user.decorator'
import { UserEntity } from '../../auth/models/user.entity'
import { APIResponse } from 'src/common/types/response.type'
import { TodoEntity } from '../models/todo.entity'
import { DataResponse } from 'src/common/types/data-response.type'
import { StringUUID } from 'src/common/types/string-uuid.type'

@Controller('todo')
@UseGuards(AuthGuard('jwt'))
export class TodoController {
    constructor (private service: TodoService) {}

    @Post()
    createNew (
        @Body() newTodo: TodoDTO,
        @GetUser() user: UserEntity
    ): Promise<APIResponse<TodoEntity>> {
        return this.service.createOne(newTodo, user)
    }

    @Get()
    getAll (
        @GetUser() user: UserEntity,
        @Query('page', ParseIntPipe)
        page: number,
        @Query('limit', ParseIntPipe)
        limit: number,
        @Query('keyword')
        keyword: string
    ): Promise<APIResponse<DataResponse<TodoEntity>>> {
        return this.service.getAll(user.id, page, limit, keyword)
    }

    @Get('byID/:id')
    getByID (@Param('id') id: StringUUID): Promise<APIResponse<TodoEntity>> {
        return this.service.getByID(id)
    }

    @Patch(':id')
    update (
        @Param('id') id: StringUUID,
        @Body() partialTodoDTO: Partial<TodoDTO>
    ): Promise<APIResponse<StringUUID>> {
        return this.service.updateTodo(id, partialTodoDTO)
    }

    @Delete(':id')
    delete (@Param('id') id: StringUUID): Promise<APIResponse<StringUUID>> {
        return this.service.deleteTodo(id)
    }
}
