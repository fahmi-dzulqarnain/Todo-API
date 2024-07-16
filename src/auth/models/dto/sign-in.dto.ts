import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SignInDTO {
    @ApiProperty({ example: 'test@example.com', description: 'User email' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsString()
    email: string

    @ApiProperty({
        example: 'thisIsStrongPassword123!',
        description:
            'The recommendation is to use a strong password which contains at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    password: string
}
