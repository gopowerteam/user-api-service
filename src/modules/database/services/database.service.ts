import { readSync } from 'node-yaml'
import { get } from 'lodash'
import { isNullOrUndefined } from 'util'
import { ConfigService } from 'src/modules/config/services/config.service'
import { ConsulService } from 'src/modules/consul/services/consul.service'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { join } from 'path'

export class DatabaseService {
  constructor(private config: ConfigService, private consul: ConsulService) {}

  /**
   * 获取数据库配置
   */
  async getConfig(): Promise<TypeOrmModuleOptions> {
    const type = this.config.get('database.type')
    const service = await this.getDatabaseService()

    switch (type) {
      case 'postgres':
        return this.getPostgresConfig(service)
    }
  }

  /**
   * 获取数据库服务信息
   */
  private getDatabaseService() {
    return this.consul.findServices('postgres').then(service => ({
      address: service.Address,
      port: service.Port
    }))
  }

  /**
   * 获取postgres配置
   * @param param0
   */
  async getPostgresConfig({ address, port }): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: address,
      port: port,
      username: this.config.get('database.username'),
      password: this.config.get('database.password'),
      database: this.config.get('database.database'),
      entities: [
        join(__dirname, '..', '..', '..', 'entites/**/*.entity{.ts,.js}')
      ],
      synchronize: true
    }
  }
}
