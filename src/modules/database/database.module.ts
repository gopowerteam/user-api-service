import { Module, Inject, DynamicModule, Global } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/services/config.service'
import {
  APP_CONSUL_PROVIDER,
  APP_CONFIG_PROVIDER,
  APP_DATABASE_PROVIDER
} from 'src/core/constants'
import { TerminusModule } from '@nestjs/terminus'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConsulService } from '../consul/services/consul.service'
import { DatabaseService } from './services/database.service'

@Global()
@Module({
  providers: [DatabaseService],
  imports: [
    // 健康检查
    TypeOrmModule.forRootAsync({
      useFactory: (database: DatabaseService) => {
        return database.getConfig()
      },
      inject: [APP_DATABASE_PROVIDER]
    })
  ]
})
export class DatabaseModule {
  public static forRoot(): DynamicModule {
    const providers = [
      {
        provide: APP_DATABASE_PROVIDER,
        useFactory: async (
          config: ConfigService,
          consul: ConsulService
        ): Promise<DatabaseService> => {
          // 创建consulService
          return new DatabaseService(config, consul)
        },
        inject: [APP_CONFIG_PROVIDER, APP_CONSUL_PROVIDER]
      }
    ]

    return {
      module: DatabaseModule,
      providers: [...providers],
      exports: [...providers, TypeOrmModule]
    }
  }
}
