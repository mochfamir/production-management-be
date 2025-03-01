import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'; // Import UnauthorizedException
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      role: string;
      name: string;
    },
  ) {
    return this.authService.register(
      body.email,
      body.password,
      body.role,
      body.name,
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials'); // Gunakan UnauthorizedException
    return this.authService.login(user);
  }
}
