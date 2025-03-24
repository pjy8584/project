import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body('credential') credential: string) {
    const user = await this.authService.verifyGoogleToken(credential);
    
    // 여기서 DB 저장 + JWT 발급 가능!
    return {
      message: '구글 로그인 성공!',
      user,
    };
  }
}