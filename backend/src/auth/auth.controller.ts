import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body('credential') credential: string) {
    
    console.log('✅ 받은 credential:', credential);
    const user = await this.authService.verifyGoogleToken(credential);

    // JWT 토큰을 클라이언트에 응답으로 보내기
    return {
      message: '구글 로그인 성공!',
      user:{
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token: user.jwtToken,  // 클라이언트에게 JWT 토큰 전달
    };
  }
}