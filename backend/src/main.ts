import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:5173'], // 프론트 도메인
    credentials: true, // 쿠키와 인증 헤더를 허용
  });

  const PORT = process.env.PORT ?? 3000; // 포트 번호 설정
  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();