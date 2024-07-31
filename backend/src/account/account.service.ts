import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities';
import { Session } from 'src/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  getAccounts() {
    const accounts = this.accountRepository.find();
    accounts.then((data) => {
      data.map((account) => {
        delete account.hashedPassword;
      });
    });
    return accounts;
  }

  async getMe(token: string): Promise<Account> {
    const session = await this.sessionRepository.findOne({
      where: { token },
      relations: ['account'],
    });

    if (!session) {
      throw new UnauthorizedException('Session không tồn tại');
    }
    return session.account;
  }

  updateAccount() {
    return 'This action updates a user';
  }
}
