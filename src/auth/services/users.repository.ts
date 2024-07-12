import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { SignUpDTO } from '../models/dto/sign-up.dto'
import { APIResponse } from 'src/common/types/response.type'
import { UserEntity } from '../models/user.entity'

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor (dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager())
    }

    async createUser (dto: SignUpDTO): Promise<APIResponse<null>> {
        const { email, password } = dto

        const saltRounds = 13
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = {
            email,
            password: hashedPassword,
            fullName: dto.fullName,
        }
        const user = this.create(newUser)

        try {
            await this.save(user)
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Account Created Successfully',
            }
        } catch (error) {
            throw new InternalServerErrorException(`Error: ${error.message}`)
        }
    }
}
