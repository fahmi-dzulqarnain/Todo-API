import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { TodoEntity } from 'src/todo/models/todo.entity'

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    fullName: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ default: null })
    deleteAt: Date

    @OneToMany(() => TodoEntity, todo => todo.user)
    todos: TodoEntity[]
}
