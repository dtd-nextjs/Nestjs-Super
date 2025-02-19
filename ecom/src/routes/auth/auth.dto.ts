import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const RegisterBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(1).max(100),
    confirmPassword: z.string().min(6).max(100),
    phoneNumber: z.string().min(10).max(15),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
      })
    }
  })

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

const UserSchema = z
  .object({
    email: z.string().email(),
  })
  .strict()

export class UserResDTO extends createZodDto(UserSchema) {}
