import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'
import { RegisterBodyDTO, RegisterResDTO } from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    console.log('controler....')
    // return new RegisterResDTO(await this.authService.register(body))
    return await this.authService.register(body)
  }
}
