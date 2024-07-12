import { UserEntity } from 'src/auth/models/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UUID } from 'typeorm/driver/mongodb/bson.typings'

@Entity('todo')
export class TodoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column({ default: false })
    isCompleted: boolean

    @Column({ default: null })
    deletedAt?: Date

    @ManyToOne(() => UserEntity, user => user.todos)
    user: UserEntity
}
