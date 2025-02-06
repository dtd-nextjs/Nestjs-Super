import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from 'src/shared/interceptor/logging.interceptor'
import { TransformInterceptor } from 'src/shared/interceptor/transform.interceptor'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field không được khai báo decorator trong DTO
      forbidNonWhitelisted: true, // Nếu có field không được khai báo decorator trong DTO mà client truyền lên thì sẽ báo lỗi
      transform: true, // Tự động chuyển đổi dữ liệu sang kiểu được khai báo trong DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints as any).join(', '),
          })),
        )
      },
    }),
  )
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
