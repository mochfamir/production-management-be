import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common'; // Import UnauthorizedException
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      role?: string;
      name: string;
    },
  ) {
    return this.authService.register(
      body.email,
      body.password,
      body.role || 'OPERATOR',
      body.name,
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials'); // Gunakan UnauthorizedException
    return this.authService.login(user);
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt')) // Gunakan AuthGuard('jwt') untuk memvalidasi token
  verifyToken(@Request() req) {
    // Data pengguna tersedia di req.user setelah token divalidasi
    return {
      message: 'Token is valid',
      user: req.user, // Kembalikan data pengguna dari token
    };
  }
}
