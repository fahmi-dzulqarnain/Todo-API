import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { UUID } from 'typeorm/driver/mongodb/bson.typings'

export class TodoDTO {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsString()
    description: string

    @IsBoolean()
    isCompleted: boolean
}
