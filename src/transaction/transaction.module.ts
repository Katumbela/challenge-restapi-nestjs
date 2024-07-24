 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { User } from '../user/user.entity';
import { Service } from '../service/service.entity';
import { TransactionController } from './transaction.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction, User, Service])],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule { }
