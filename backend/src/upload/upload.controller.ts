// 📄 backend/src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as cheerio from 'cheerio';
import { OpenAIService } from '../openai/openai.service';

interface WatchRecord {
  type: 'video' | 'music' | 'channel';
  title: string;
  category?: string;
  date?: Date | null;
}

@Controller('upload')
export class UploadController {
  constructor(private readonly openaiService: OpenAIService) {}

  private extractDateFromText(text: string): Date | null {
    const match = text.match(
      /(\d{4})\. (\d{1,2})\. (\d{1,2})\. (오전|오후) (\d{1,2}):(\d{2}):(\d{2}) KST/
    );
    if (!match) return null;
    const [, year, month, day, ampm, hourStr, minStr, secStr] = match;
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10);
    const second = parseInt(secStr, 10);
    if (ampm === '\uc624\ud6c4' && hour !== 12) hour += 12;
    if (ampm === '\uc624\uc804' && hour === 12) hour = 0;
    return new Date(+year, +month - 1, +day, hour, minute, second);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handleUpload(@UploadedFile() file: Express.Multer.File): Promise<WatchRecord[]> {
    const html = file.buffer.toString('utf-8');
    const $ = cheerio.load(html);
    const rawRecords: WatchRecord[] = [];

    $('div.content-cell').each((_, el) => {
      const anchor = $(el).find('a');
      const href = anchor.attr('href') || '';
      const title = anchor.text().trim();
      const fullText = $(el).text().trim();
      const parsedDate = this.extractDateFromText(fullText);

      if (!href || !title || !parsedDate) return;

      if (href.includes('watch') && href.includes('music')) {
        rawRecords.push({ type: 'music', title, date: parsedDate });
      } else if (href.includes('watch')) {
        rawRecords.push({ type: 'video', title, date: parsedDate });
      } else if (href.includes('channel') || href.includes('user') || href.includes('@')) {
        rawRecords.push({ type: 'channel', title, date: parsedDate });
      }
    });

    console.log('✅ 최종 영상 레코드 수:', rawRecords.length);

    const latestVideos = rawRecords.filter(r => r.type === 'video').slice(0, 1);
    const videoTitles = latestVideos.map(v => v.title);
    const categories = await this.openaiService.categorizeTitlesBatch(videoTitles);
    console.log('🧠 OpenAI 카테고리 응답:', categories);

    const categorizedVideos: WatchRecord[] = latestVideos.map((record, i) => ({
      ...record,
      category: categories[i] || 'Other',
    }));

    return categorizedVideos;
  }

  @Post('/channels')
  @UseInterceptors(FileInterceptor('file'))
  async handleChannelFrequency(@UploadedFile() file: Express.Multer.File): Promise<{ name: string; count: number }[]> {
    const html = file.buffer.toString('utf-8');
    const $ = cheerio.load(html);
    const elements = $('a').toArray();
    const channelList: string[] = [];
    let videoCount = 0;

    for (let i = 0; i < elements.length - 1; i++) {
      const current = $(elements[i]);
      const next = $(elements[i + 1]);
      const href = current.attr('href') || '';
      const nextHref = next.attr('href') || '';
      if (href.includes('watch') && !href.includes('music')) {
        const channelName = nextHref.includes('channel') || nextHref.includes('user') || nextHref.includes('@')
          ? next.text()
          : 'Unknown';
        channelList.push(channelName);
        videoCount++;
      }
      if (videoCount >= 1000) break;
    }

    const freqMap: Record<string, number> = {};
    channelList.forEach((name) => {
      freqMap[name] = (freqMap[name] || 0) + 1;
    });

    console.log('📊 [CHANNEL] 추출된 채널 수:', channelList.length);

    return Object.entries(freqMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100);
  }

  @Post('/watch-time')
  @UseInterceptors(FileInterceptor('file'))
  async handleWatchTimeHeatmap(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ day: string; hour: number; count: number }[]> {
    const html = file.buffer.toString('utf-8');
    const $ = cheerio.load(html);

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const dates: Date[] = [];

    $('div.content-cell').each((_, el) => {
      const anchor = $(el).find('a');
      const href = anchor.attr('href') || '';
      const fullText = $(el).text().trim();
      const parsedDate = this.extractDateFromText(fullText);


      if (href.includes('watch') && parsedDate) {
        if (parsedDate < oneWeekAgo) return;
        dates.push(parsedDate);
      }
    });

    const heatmap: Record<string, Record<number, number>> = {};

    for (const date of dates) {
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const hour = date.getHours();
      if (!heatmap[day]) heatmap[day] = {};
      heatmap[day][hour] = (heatmap[day][hour] || 0) + 1;
    }

    const result = Object.entries(heatmap).flatMap(([day, hourMap]) =>
      Object.entries(hourMap).map(([hourStr, count]) => ({
        day,
        hour: Number(hourStr),
        count,
      }))
    );

    console.log('📈 [HEATMAP] 최근 1주일 기준 데이터 포인트 수:', result.length);
    return result;
  }
}
