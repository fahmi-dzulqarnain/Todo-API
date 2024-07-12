import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from './common/transform.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap () {
    const app = await NestFactory.create(AppModule)

    app.enableCors()
    app.useGlobalInterceptors(new TransformInterceptor())
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        })
    )
    const options = new DocumentBuilder()
        .setTitle('NestJS Todo App')
        .setDescription('A simple todo app built with NestJS')
        .setVersion('1.0')
        .addTag('todo')
        .build()

    const document = SwaggerModule.createDocument(app, options)

    SwaggerModule.setup('api', app, document)

    await app.listen(1724)
}
bootstrap()
