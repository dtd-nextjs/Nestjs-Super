import { IsString } from 'class-validator'

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
