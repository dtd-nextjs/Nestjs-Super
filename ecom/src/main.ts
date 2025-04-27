import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { WebsocketAdapter } from 'src/websockets/websocket.adapter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.useWebSocketAdapter(new WebsocketAdapter(app))
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
