import { Exclude, Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { SuccessResDTO } from 'src/shared/shared.dto'

export class LoginBodyDTO {
  @IsString()
  email: string
  @IsString()
  password: string
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({ message: 'Tên phải là chuỗi' })
  name: string

  @IsString()
  confirmPassword: string
}

class RegisterData {
  id: number
  email: string
  name: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<RegisterData>) {
    Object.assign(this, partial)
  }
}

export class RegisterResDTO extends SuccessResDTO {
  @Type(() => RegisterData)
  data: RegisterData

  constructor(partial: Partial<RegisterResDTO>) {
    super(partial)
    Object.assign(this, partial)
  }
}
