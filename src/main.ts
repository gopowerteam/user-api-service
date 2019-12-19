import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Application } from './core/application'
import { APP_CONFIG_PROVIDER } from './core/constants'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

// https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

async function bootstrap() {
  const app = await NestFactory.create(AppModule).then(Application.initialize)

  const options = new DocumentBuilder()
    .setTitle('User Api Document')
    .setDescription('The project power by GoPower team')
    .setVersion('0.0.1')
    .addTag('default')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  // 获取配置服务
  const config = app.get(APP_CONFIG_PROVIDER)
  // 获取监听端口
  const port = config.get('service.port')
  // 建立服务监听
  await app.listen(port)
}

bootstrap()
