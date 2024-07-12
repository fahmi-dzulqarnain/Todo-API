import { UserEntity } from './user.entity'

export class SignInResponse {
    accessToken: string
    user: UserEntity
}
