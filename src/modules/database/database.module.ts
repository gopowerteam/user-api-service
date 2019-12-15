import { Module, Inject, DynamicModule, Global } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/services/config.service'
import {
  APP_CONSUL_PROVIDER,
  APP_CONFIG_PROVIDER,
  APP_DATABASE_PROVIDER
} from 'src/core/constants'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConsulService } from '../consul/services/consul.service'
import { DatabaseService } from './services/database.service'
import { User } from 'src/entities/user.entity'
import { join } from 'path'

@Global()
@Module({
  providers: [DatabaseService]
})
export class DatabaseModule {
  public static async forRoot(
    entityPath = join(__dirname, '..', '..', 'entities')
  ): Promise<DynamicModule> {
    const entities = await DatabaseService.getEntities(entityPath)
    const providers = [
      {
        provide: APP_DATABASE_PROVIDER,
        useFactory: async (
          config: ConfigService,
          consul: ConsulService
        ): Promise<DatabaseService> => {
          return new DatabaseService(config, consul, entityPath)
        },
        inject: [APP_CONFIG_PROVIDER, APP_CONSUL_PROVIDER]
      }
    ]

    return {
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (database: DatabaseService) => {
            return database.getConfig()
          },
          inject: [APP_DATABASE_PROVIDER]
        }),
        TypeOrmModule.forFeature(entities)
      ],
      module: DatabaseModule,
      providers: [...providers],
      exports: [...providers, TypeOrmModule]
    }
  }
}
