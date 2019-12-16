import {
  IsString,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsDateString
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class RegisterDto {
  @IsString()
  @ApiProperty({
    description: '用户名'
  })
  public readonly username: string

  @IsDateString()
  @ApiProperty({
    description: '用户密码'
  })
  public readonly password: number
}
