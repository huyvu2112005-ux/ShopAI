import {Body, ConflictException, Controller, Global, HttpCode, HttpStatus, Injectable, Module, Post, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtModule, JwtService} from '@nestjs/jwt';
import {AuthGuard, PassportModule, PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ApiProperty, ApiTags} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, ValidateBy} from 'class-validator';
import {Transform} from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {Prisma} from '@prisma/client';
import {PrismaService} from '../prisma/prisma.module';
export class LoginDto {
 @ApiProperty({example: 'demo@shopai.com'}) @Transform(({value}) => typeof value === 'string' ? value.trim().toLowerCase() : value) @IsEmail() @MaxLength(254) email: string;
 @ApiProperty({example: '123456'}) @IsString() @MinLength(6) @MaxLength(72)
 @ValidateBy({name: 'maxPasswordBytes', validator: {
  validate: value => typeof value === 'string' && Buffer.byteLength(value, 'utf8') <= 72,
  defaultMessage: () => 'Mật khẩu không được vượt quá 72 byte UTF-8',
 }}) password: string;
}
export class RegisterDto extends LoginDto {
 @ApiProperty() @Transform(({value}) => typeof value === 'string' ? value.trim() : value) @IsString() @IsNotEmpty() @MaxLength(100) name: string;
}
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
 constructor(config: ConfigService, private readonly prisma: PrismaService) {super({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: config.getOrThrow<string>('JWT_SECRET')});}
 async validate(payload: {sub?: unknown} | null) {
  if (!payload || typeof payload.sub !== 'string' || !payload.sub) throw new UnauthorizedException();
  const user = await this.prisma.user.findUnique({where: {id: payload.sub}});
  if (!user) throw new UnauthorizedException();
  return {id: user.id};
 }
}
@Injectable()
export class AuthService {
 constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}
 private session(user: {id: string; email: string; name: string | null}) {return {accessToken: this.jwt.sign({sub: user.id, email: user.email}), user: {id: user.id, email: user.email, name: user.name}};}
 async login(dto: LoginDto) {const user = await this.prisma.user.findUnique({where: {email: dto.email.toLowerCase().trim()}}); if (!user || !await bcrypt.compare(dto.password, user.password)) throw new UnauthorizedException('Email hoặc mật khẩu không đúng'); return this.session(user);}
 async register(dto: RegisterDto) {
  try {return this.session(await this.prisma.user.create({data: {email: dto.email.toLowerCase().trim(), name: dto.name.trim(), password: await bcrypt.hash(dto.password, 12)}}));}
  catch (e) {if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Email đã được đăng ký'); throw e;}
 }
}
@ApiTags('Auth')
@Controller('api/auth')
class AuthController {
 constructor(private readonly auth: AuthService) {}
 @Post('login') @HttpCode(HttpStatus.OK) login(@Body() dto: LoginDto) {return this.auth.login(dto);}
 @Post('register') register(@Body() dto: RegisterDto) {return this.auth.register(dto);}
}
@Global()
@Module({imports: [PassportModule, JwtModule.registerAsync({inject: [ConfigService], useFactory: (config: ConfigService) => ({secret: config.getOrThrow<string>('JWT_SECRET'), signOptions: {expiresIn: '1d'}})})], controllers: [AuthController], providers: [AuthService, JwtStrategy, JwtAuthGuard], exports: [JwtAuthGuard]})
export class AuthModule {}
