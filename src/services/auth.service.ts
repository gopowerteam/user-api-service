import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getManager, createQueryBuilder } from 'typeorm'
import { UserEntity } from 'src/entities/user.entity'
import { UserPasswordEntity } from 'src/entities/user-password.entity'
import { resolve } from 'dns'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserPasswordEntity)
    private readonly passwordRepository: Repository<UserPasswordEntity>
  ) {}

  /**
   * 注册用户信息
   * @param param0
   */
  public register({ username, password }) {
    getManager()
      .transaction(async transactionalEntityManager => {
        const user = new UserEntity()
        user.username = username
        await transactionalEntityManager.save(user)

        const userPassword = new UserPasswordEntity()
        userPassword.password = password
        userPassword.user = user
        await transactionalEntityManager.save(userPassword)
      })
      .then(data => console.log(data))
  }

  public login({ username, password }) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.password', 'password')
      .where({ username: username })
      .andWhere('password.password = :password', {
        password: password
      })
      .andWhere('password.valid = :valid', {
        valid: true
      })
      .getOne()
  }
}
