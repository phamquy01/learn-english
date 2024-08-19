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
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async finByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  isEmailExist = async (email: string) => {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) return true;
    return false;
  };

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
    const isEmail = await this.isEmailExist(email);
    if (isEmail === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}`);
    }
    const hashedPassword = await hashedPasswordHelper(password);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isActive: false,
      codeId: uuidv4(),
      codeExpired: dayjs().add(1, 'minute').toDate(),
    });

    this.mailerService.sendMail({
      to: email,
      subject: 'Xác nhận tài khoản',
      template: 'register',
      context: {
        name: user.name ?? user.email,
        activationCode: user.codeId,
      },
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
    };
  }
}
