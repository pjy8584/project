import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';  // JWT 서비스 가져오기

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(private readonly jwtService: JwtService) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token: string) {
    try {

      console.log('🟡 전달된 token:', token);
      
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      console.log('✅ ticket:', ticket);

      const payload = ticket.getPayload();
      console.log('✅ payload:', payload);

      // JWT 발급
      const jwtToken = this.jwtService.sign({
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture,
        sub: payload?.sub,  // 구글 사용자 ID
      });

      return {
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture,
        jwtToken,  // JWT 토큰 추가
      };
    } catch (error) {
      console.error('❌ verifyGoogleToken error:', error);
      throw new Error('구글 토큰 검증 실패!');
    }
  }
}