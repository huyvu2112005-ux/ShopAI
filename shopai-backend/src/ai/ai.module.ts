import {BadRequestException, Body, Controller, Injectable, Logger, Module, Post, ServiceUnavailableException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ApiProperty, ApiPropertyOptional, ApiTags} from '@nestjs/swagger';
import {Throttle} from '@nestjs/throttler';
import {ArrayMaxSize, IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {ApiError} from '@google/genai';
import {requestGeminiInteraction, withGeminiRetry} from './gemini-request';
import {ProductModule, ProductService} from '../product/product.module';
import {buildShopPrompt} from './ai-prompt';
class HistoryDto {
 @ApiProperty({enum: ['user', 'model']}) @IsIn(['user', 'model']) role: 'user' | 'model';
 @ApiProperty() @Transform(({value}) => typeof value === 'string' ? value.trim() : value) @IsString() @IsNotEmpty() @MaxLength(4000) text: string;
}
export class ChatDto {
 @ApiProperty() @Transform(({value}) => typeof value === 'string' ? value.trim() : value) @IsString() @IsNotEmpty() @MaxLength(2000) message: string;
 @ApiPropertyOptional({type: [HistoryDto]}) @IsOptional() @IsArray() @ArrayMaxSize(10) @ValidateNested({each: true}) @Type(() => HistoryDto) history?: HistoryDto[];
}
@Injectable()
class AiService {
 private readonly logger = new Logger(AiService.name);
 constructor(private readonly config: ConfigService, private readonly products: ProductService) {}
 async chat(dto: ChatDto) {
  const history = dto.history ?? [];
  if (history.some((h, i) => h.role !== (i % 2 === 0 ? 'user' : 'model')) || history.length % 2 !== 0) throw new BadRequestException('Ngữ cảnh hội thoại chưa hợp lệ');
  const apiKey = this.config.get<string>('GEMINI_API_KEY');
  if (!apiKey) throw new ServiceUnavailableException('Chưa cấu hình Gemini API Key trên Server');
  const model = this.config.get<string>('GEMINI_MODEL') || 'gemini-3.5-flash-lite';
  try {
   // A shared deadline bounds both attempts below the mobile's 30s timeout.
   const deadline = Date.now() + 26000;
   const reply = await withGeminiRetry(() => requestGeminiInteraction({apiKey, model, message: dto.message, history, deadline, systemInstruction: buildShopPrompt(this.products.getAll())}), deadline);
   return {reply};
  } catch (error) {
   const status = error instanceof ApiError ? error.status : undefined;
   this.logger.warn(`Gemini request failed: status=${status ?? 'unknown'}, model=${model}`);
   const message = status === 404 ? 'Model Gemini không khả dụng, vui lòng kiểm tra cấu hình Server'
    : status === 401 || status === 403 ? 'Gemini API Key chưa có quyền truy cập, vui lòng kiểm tra cấu hình Server'
    : status === 429 ? 'Gemini đã đạt giới hạn sử dụng, vui lòng thử lại sau'
    : 'AI đang bận, vui lòng thử lại sau';
   throw new ServiceUnavailableException(message);
  }
 }
}
@ApiTags('Ai') @Controller('api/ai')
class AiController {
 constructor(private readonly ai: AiService) {}
 @Post('chat') @Throttle({default: {limit: 10, ttl: 60000}}) chat(@Body() dto: ChatDto) {return this.ai.chat(dto);}
}
@Module({imports: [ProductModule], controllers: [AiController], providers: [AiService]})
export class AiModule {}
