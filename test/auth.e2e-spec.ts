import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, HttpStatus } from '@nestjs/common'
import * as request from 'supertest'
import * as bcrypt from 'bcrypt'
import { AuthModule } from '../src/auth/auth.module'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../src/auth/services/users.repository'
import { randomUUID } from 'crypto'
import { UserEntity } from '../src/auth/models/user.entity'
import { AuthService } from '../src/auth/services/auth.service'
import { JwtStrategy } from '../src/auth/jwt.strategy'
import { TodoEntity } from '../src/todo/models/todo.entity'
import { DataSource } from 'typeorm'

describe('AuthService (e2e)', () => {
    let app: INestApplication,
        jwtService: JwtService,
        userRepository: UserRepository,
        mockUser: UserEntity,
        mockedPassword: string

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
                TypeOrmModule.forFeature([ UserEntity ]),
                // TODO: Make a separate file to setup test db
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost', //env.DB_HOST,
                    port: 5432, //parseInt(<string>env.DB_PORT),
                    username: 'postgrestodo', //env.DB_USER,
                    password: 'T0dOl1sTs3cr3t',
                    database: 'postgres',
                    entities: [ UserEntity, TodoEntity ],
                    autoLoadEntities: true,
                    synchronize: true,
                    dropSchema: false,
                    logging: false,
                }),
                JwtModule.register({
                    secret: 'T0dOl1sTs3cr3t',
                    signOptions: {
                        expiresIn: '100m',
                    },
                }),
            ],
            providers: [ AuthService, UserRepository, JwtStrategy ],
        }).compile()

        app = moduleFixture.createNestApplication()
        jwtService = moduleFixture.get<JwtService>(JwtService)
        userRepository = moduleFixture.get<UserRepository>(
            getRepositoryToken(UserRepository)
        )

        await app.init()
    })

    beforeEach(async () => {
        const saltRounds = 13
        const salt = await bcrypt.genSalt(saltRounds)

        mockedPassword = 'password123'
        mockUser = {
            id: randomUUID().toString(),
            email: 'test@example.com',
            password: await bcrypt.hash(mockedPassword, salt),
            fullName: 'Test User',
            createdAt: new Date(),
            deleteAt: null,
            todos: [],
        }
    })

    afterAll(async () => {
        const dataSource = app.get<DataSource>(DataSource)
        await dataSource.destroy()
        await app.close()
    })

    describe('POST /auth/signUp', () => {
        it('should create a new user', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null)
            jest.spyOn(userRepository, 'createUser').mockResolvedValue({
                statusCode: HttpStatus.CREATED,
                message: 'Account Created Successfully',
            })

            const response = await request(app.getHttpServer())
                .post('/auth/signUp')
                .send({
                    email: mockUser.email,
                    password: mockedPassword,
                    fullName: mockUser.fullName,
                })

            expect(response.status).toBe(HttpStatus.CREATED)
            expect(response.body.statusCode).toBe(HttpStatus.CREATED)
            expect(response.body.message).toBe('Account Created Successfully')
        })

        it('should return 403 if user already exists', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser)

            const response = await request(app.getHttpServer())
                .post('/auth/signUp')
                .send({
                    email: mockUser.email,
                    password: mockedPassword,
                })

            expect(response.status).toBe(HttpStatus.FORBIDDEN)
        })
    })

    describe('POST /auth/signIn', () => {
        it('should sign in a user', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser)

            const response = await request(app.getHttpServer())
                .post('/auth/signIn')
                .send({
                    email: mockUser.email,
                    password: mockedPassword,
                })

            expect(response.status).toBe(HttpStatus.OK)
            expect(response.body.data.accessToken).toBeDefined()
        })

        it('should return 404 if user does not exist', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null)

            const response = await request(app.getHttpServer())
                .post('/auth/signIn')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                })

            expect(response.status).toBe(HttpStatus.NOT_FOUND)
        })

        it('should return 403 if password is incorrect', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser)

            const response = await request(app.getHttpServer())
                .post('/auth/signIn')
                .send({
                    email: mockUser.email,
                    password: 'wrongpassword',
                })

            expect(response.status).toBe(HttpStatus.FORBIDDEN)
        })
    })

    describe('POST /auth/isTokenValid', () => {
        it('should validate a token', async () => {
            const token = await jwtService.signAsync({
                email: mockUser.email,
            })

            const response = await request(app.getHttpServer())
                .post('/auth/isTokenValid')
                .send({ token })

            expect(response.status).toBe(HttpStatus.OK)
            expect(response.body.data).toBe(true)
        })

        it('should return 401 if token is invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/isTokenValid')
                .send({ token: 'invalidtoken' })

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED)
        })
    })
})
