import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { AppService } from './app.service'
import { ConfigModule } from './modules/config/config.module'
import { join } from 'path'
import { ConsulModule } from './modules/consul/consul.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from './modules/database/database.module'
@Module({
  imports: [
    ConfigModule.forRoot(join(__dirname, '..', 'config.yml')),
    ConsulModule.forRoot(),
    DatabaseModule.forRoot()
  ],
  controllers: [AuthController],
  providers: [AppService]
})
export class AppModule {}
