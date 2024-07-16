import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from './user.entity'

export class SignInResponse {
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZkei5maHoxMzAyQGdtYWlsLmNvbSIsImlhdCI6MTcxNjQ1NzQxNiwiZXhwIjoxNzE2NDYzNDE2fQ.QnBzSKel5DnMUHi27M6RX0Udie5pRbyxVIB6camNWNg',
        description:
            'Access token for accessing protected routes, only active for 100 minutes before the new one is generated',
    })
    accessToken: string

    @ApiProperty({
        example: {
            id: 'f43208a3-a370-4e6b-8a36-fefb2d52eda5',
            email: 'test@example.com',
            fullName: 'Muhammad Ali',
            createdAt: '2024-07-10T16:56:11.878Z',
            deleteAt: null,
        },
        description: 'User data that has been signed in successfully',
    })
    user: UserEntity
}
