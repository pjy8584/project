// 📄 backend/src/openai/openai.service.ts
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async categorizeTitlesBatch(titles: string[]): Promise<string[]> {
    const prompt = `
아래는 사용자의 최근 유튜브 시청 영상 제목 목록입니다.
각 영상은 사용자의 일상 속 활동, 관심사, 소비 패턴, 여가, 학습 등의 내용을 포함할 수 있습니다.

각 제목을 가장 적절한 카테고리로 분류해주세요.
반드시 영상 내용을 고려해서 가장 알맞은 카테고리를 선택해야 합니다.

📌 가능한 카테고리는 다음 중 하나입니다:
[Vlog, Music, Game, News, Sports, Study, Food, Finance, Tech, Comedy]

👉 반환 형식:
쉼표로 구분된 카테고리 목록만 한 줄로 응답해주세요. 예) Music, Entertainment, News, ...

제목 목록:
${titles.map((title, idx) => `${idx + 1}. ${title}`).join('\n')}

답변:
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 200,
    });

    const text = response.choices[0].message.content || '';
    console.log('🧠 GPT 응답:', text);
    return text
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
  }
}