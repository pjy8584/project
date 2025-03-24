import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 
    }),
    AuthModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}