import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { RegisterDto } from 'src/dto/auth/register.dto'
import { AuthService } from 'src/services/auth.service'
import { LoginDto } from 'src/dto/auth/login.dto'
import { isNullOrUndefined } from 'util'

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  public async register(@Body() registerDto: RegisterDto) {
    await this.authService.register({
      username: registerDto.username,
      password: registerDto.password
    })
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/login')
  public async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login({
      username: loginDto.username,
      password: loginDto.password
    })

    if (isNullOrUndefined(user)) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    } else {
      return user
    }
  }
}
