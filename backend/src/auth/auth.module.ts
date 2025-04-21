import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';
import { Translation } from 'src/modules/translate/entities/translate.entity';
import { UserModule } from 'src/modules/user/user.module';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from 'src/auth/passport/local.strategy';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/passport/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { Token } from 'src/modules/token/entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Translation]),
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
