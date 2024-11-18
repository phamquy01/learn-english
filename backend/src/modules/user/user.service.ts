import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashedPasswordHelper } from 'src/helper/utils';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import aqp from 'api-query-params';
import { UpdateUserDTO } from 'src/modules/user/dto/update-user.dto';
import { Repository } from 'typeorm';
import { CreateAuthDTO } from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { Token } from 'src/modules/token/entities/token.entity';
import { CodeAuthDTO } from 'src/auth/dto/code-auth.dto';
import { CustomErrorException } from 'src/exception';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async finByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  isEmailExist = async (email: string) => {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) return true;
    return false;
  };

  sendEmail(user: User) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Xác nhận tài khoản',
      template: 'register',
      context: {
        name: user.name ?? user.email,
        activationCode: user.codeId,
      },
    });
  }

  async getUsers(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (current) delete filter.current;
    if (pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = await this.userRepository.count({ where: filter });
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * pageSize;

    const result = await this.userRepository.find({
      where: filter,
      take: pageSize,
      skip: skip,
      order: sort,
      select: [
        'id',
        'name',
        'email',
        'phone',
        'address',
        'image',
        'createdAt',
        'updatedAt',
      ],
    });
    return { result, totalPages };
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const { name, email, password, phone, address, image } = createUserDTO;
    const isEmail = await this.isEmailExist(email);
    if (isEmail === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}`);
    }
    const hashedPassword = await hashedPasswordHelper(password);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      image,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
    };
  }

  async updateUser(updateUserDTO: UpdateUserDTO) {
    return await this.userRepository.update(
      {
        id: updateUserDTO.id,
      },
      { ...updateUserDTO },
    );
  }

  async deleteUser(id: string) {
    const tokenId = await this.tokenRepository.findOne({
      where: { user: { id } },
    });

    if (tokenId) {
      await this.tokenRepository.delete({ id: tokenId.id });
    }

    const userId = await this.userRepository.findOne({
      where: { id },
    });

    if (!userId) {
      throw new BadRequestException(`Không tìm thấy user id: ${id}`);
    }

    return await this.userRepository.delete({ id });
  }

  async register(registerDTO: CreateAuthDTO) {
    const { name, email, password } = registerDTO;

    const isName = await this.userRepository.findOne({ where: { name } });
    if (isName) {
      throw new CustomErrorException([
        { field: 'name', message: 'Username already exists' },
      ]);
    }

    const isEmail = await this.isEmailExist(email);
    if (isEmail === true) {
      throw new CustomErrorException([
        { field: 'email', message: 'Email already exists' },
      ]);
    }
    const hashedPassword = await hashedPasswordHelper(password);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isActive: false,
      codeId: uuidv4(),
      codeExpired: dayjs().add(5, 'minutes').toDate(),
    });

    this.sendEmail(user);

    const savedUser = await this.userRepository.save(user);

    return {
      message: 'register success',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      },
    };
  }

  async checCode(codeAuthDTO: CodeAuthDTO) {
    const user = await this.userRepository.findOne({
      where: { id: codeAuthDTO.id, codeId: codeAuthDTO.code },
    });

    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }

    const isBeforeExpired = dayjs().isBefore(user.codeExpired);

    if (isBeforeExpired) {
      await this.userRepository.update(
        {
          id: user.id,
        },
        { isActive: true },
      );
      return {
        message: 'Xác nhận thành công',
      };
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }
  }

  async resendCode(email: string) {
    await this.userRepository.update(
      {
        email,
      },
      {
        codeId: uuidv4(),
        codeExpired: dayjs().add(5, 'minutes').toDate(),
      },
    );

    const user = await this.finByEmail(email);

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    this.sendEmail(user);

    return {
      id: user.id,
      message: 'Gửi lại mã code thành công',
    };
  }
}
