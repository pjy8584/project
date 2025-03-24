import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      return {
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture,
        sub: payload?.sub, // 구글 사용자 ID
      };
    } catch (error) {
      throw new Error('구글 토큰 검증 실패!');
    }
  }
}