import { IsNotEmpty, IsString } from 'class-validator'

export class SignInDTO {
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsString()
    email: string

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    password: string
}
