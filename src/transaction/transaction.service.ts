 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
import { Service } from '../service/service.entity';
import { ErrorResponse } from '../common/error-response';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) { }

  async createTransaction(clientId: number, serviceId: number): Promise<Transaction | ErrorResponse> {
    const client = await this.userRepository.findOne({ where: { id: clientId } });
    const service = await this.serviceRepository.findOne({ where: { id: serviceId }, relations: ['provider'] });

    if (!client || !service) {
      return new ErrorResponse('Client or service not found');
    }

    if (client.balance < service.price) {
      return new ErrorResponse('Insufficient balance');
    }

    client.balance -= service.price;
    service.provider.balance += service.price;

    await this.userRepository.save(client);
    await this.userRepository.save(service.provider);

    const transaction = this.transactionRepository.create({
      client,
      provider: service.provider,
      service,
      amount: service.price,
      date: new Date(),
    });

    return this.transactionRepository.save(transaction);
  }

  async getTransactionHistory(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: [
        { client: { id: userId } },
        { provider: { id: userId } },
      ],
      relations: ['client', 'provider', 'service'],
    });
  }
}
