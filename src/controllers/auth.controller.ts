import { Controller, Get, Post } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/entities/user.entity'

@Controller('/auth')
export class AuthController {
  constructor() {}

  @Post('/register')
  public register() {
    return 'hello'
  }

  @Post('/login')
  public login() {
    return 'hello'
  }
}
