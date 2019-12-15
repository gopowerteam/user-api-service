import { Controller, Get } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/entities/user.entity'

@Controller('/auth')
export class AuthController {
  constructor() {}

  @Get()
  getHello() {
    return 'hello'
  }
}
