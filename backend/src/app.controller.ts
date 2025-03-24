import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppService } from './app.service'; // ✅ 추가!

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // ✅ 추가!

  @Get()
  getHello(): string {
    return this.appService.getHello();  // ✅ 서비스에서 메시지 가져옴!
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Request() req) {
    return {
      message: '보호된 데이터입니다!',
      user: req.user,
    };
  }
}