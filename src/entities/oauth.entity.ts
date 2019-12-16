import { Entity } from 'typeorm'
import { CommonEntity } from './base/common.entity'

@Entity('oauth')
export class OAuthEntity extends CommonEntity {}
