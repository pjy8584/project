// 📄 upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { OpenAIModule } from '../openai/openai.module'; // ✅ 추가

@Module({
  imports: [OpenAIModule], // ✅ 여기 등록해줘야 의존성 해결됨!
  controllers: [UploadController],
})
export class UploadModule {}