import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDTO } from 'src/auth/dto/create-auth.dto';
import { comparePasswordHelper } from 'src/helper/utils';
import { UserService } from 'src/modules/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.finByEmail(email);
    const isCheckedPassword = await comparePasswordHelper(pass, user.password);
    if (!user || !isCheckedPassword) return null;

    return user;
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.finByEmail(email);
    const isCheckedPassword = await comparePasswordHelper(pass, user.password);
    if (!isCheckedPassword) {
      throw new UnauthorizedException('Sai mật khẩu');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {}),
    };
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDTO: CreateAuthDTO) {
    return await this.usersService.register(registerDTO);
  }
}
