import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { APIResponse } from 'src/common/types/response.type'
import { TodoEntity } from '../models/todo.entity'
import { TodoDTO } from '../models/todo.dto'
import { StringUUID } from 'src/common/types/string-uuid.type'
import { DataResponse } from 'src/common/types/data-response.type'
import { UserEntity } from 'src/auth/models/user.entity'

@Injectable()
export class TodoService {
    constructor (
        @InjectRepository(TodoEntity)
        private repository: Repository<TodoEntity>
    ) {}

    async createOne (
        dto: TodoDTO,
        user: UserEntity
    ): Promise<APIResponse<TodoEntity>> {
        const todoWithUser = {
            ...dto,
            user,
        }

        const newTodo = this.repository.create(todoWithUser)

        try {
            await this.repository.save(newTodo)
            return {
                message: 'New todo created successfully',
                statusCode: HttpStatus.CREATED,
                data: newTodo,
            }
        } catch (error) {
            throw error.message
        }
    }

    async getAll (
        userID: StringUUID,
        page: number,
        limit: number,
        keyword: string
    ): Promise<APIResponse<DataResponse<TodoEntity>>> {
        if (limit > 50) {
            throw new BadRequestException('Todo limit cannot be more than 50')
        }

        const searchKeyword = keyword ? keyword.toLowerCase() : ''

        if (searchKeyword.length > 12) {
            throw new BadRequestException(
                'Search keyword cannot be more than 12 characters'
            )
        }

        const skipCount = limit * page - limit
        const totalRecords = await this.repository.countBy({
            deletedAt: IsNull(),
            user: { id: userID },
        })
        const totalPage = Math.ceil(totalRecords / limit)
        const todoList = await this.repository.find({
            where: {
                deletedAt: IsNull(),
                user: {
                    id: userID,
                },
            },
            take: limit,
            skip: skipCount,
        })

        const todoListFiltered = keyword
            ? todoList.filter(todo =>
                  todo.title.toLowerCase().includes(searchKeyword)
              )
            : todoList

        return {
            message: `Todo list for user ${userID} retrieved successfully`,
            statusCode: HttpStatus.OK,
            data: {
                totalRecords,
                totalPage,
                dataList: todoListFiltered,
            },
        }
    }

    async getByID (id: StringUUID): Promise<APIResponse<TodoEntity>> {
        const isExist = await this.repository.findOneBy({ id })

        if (!isExist) {
            throw new NotFoundException(`There is no todo with id ${id}`)
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: isExist,
        }
    }

    async updateTodo (
        id: string,
        todoDTO: Partial<TodoDTO>
    ): Promise<APIResponse<StringUUID>> {
        const existingTodoData = await this.getByID(id)
        let existingTodo = existingTodoData.data

        if (!existingTodo) {
            throw new NotFoundException(`Todo with id ${id} not found`)
        }

        existingTodo = { ...existingTodo, ...todoDTO }

        try {
            await this.repository.update(id, existingTodo)

            return {
                message: `Todo with id ${id} is updated successfully`,
                statusCode: HttpStatus.OK,
                data: existingTodo.id,
            }
        } catch (error) {
            throw new InternalServerErrorException(
                `Updating todo failed with error: ${error}`
            )
        }
    }

    async deleteTodo (id: StringUUID): Promise<APIResponse<StringUUID>> {
        const deletedAt = new Date()
        const existingTodoResponse = await this.getByID(id)
        const existingTodo = existingTodoResponse.data

        const todo = {
            ...existingTodo,
            deletedAt,
        }

        await this.repository.update(id, todo)
        return {
            message: `Todo with id ${id} is deleted at ${deletedAt}`,
            statusCode: HttpStatus.OK,
            data: existingTodo.id,
        }
    }
}
