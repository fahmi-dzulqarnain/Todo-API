import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator'

export class SignUpDTO {
    @IsEmail()
    @MinLength(4)
    @MaxLength(32)
    email: string

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password must contains number, special character, capital, and small letter',
    })
    password: string

    @IsString()
    @IsNotEmpty()
    fullName: string
}
