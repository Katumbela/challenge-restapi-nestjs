import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
import { Service } from '../service/service.entity';
import { ErrorResponse } from '../common/error-response';
import { UserResponseDto } from 'src/user/dto/user.dto.response';
import { TransactionResponseDto } from './dto/transaction.response.dto';

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

  async createTransaction(clientId: number, serviceId: number): Promise<TransactionResponseDto | ErrorResponse> {
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

    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.toTransactionResponseDto(savedTransaction);
  }

  async getTransactionHistory(userId: number): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.find({
      where: [
        { client: { id: userId } },
        { provider: { id: userId } },
      ],
      relations: ['client', 'provider', 'service'],
    });
    return transactions.map(this.toTransactionResponseDto);
  }

  private toTransactionResponseDto = (transaction: Transaction): TransactionResponseDto => {
    const dto = new TransactionResponseDto();
    dto.id = transaction.id;
    dto.amount = transaction.amount;
    dto.date = transaction.date;
    dto.client = this.toUserResponseDto(transaction.client);
    dto.provider = this.toUserResponseDto(transaction.provider);
    dto.serviceId = transaction.service.id; 
    return dto;
  };


  private toUserResponseDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.fullName = user.fullName;
    dto.nif = user.nif;
    dto.email = user.email;
    dto.userType = user.userType;
    dto.balance = user.balance;
    return dto;
  }
}
