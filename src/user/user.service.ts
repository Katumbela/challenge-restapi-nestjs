 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { ErrorResponse } from 'src/common/error-response';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(user: User): Promise<User | ErrorResponse> {
         
        const existingUserByNif = await this.userRepository.findOne({ where: { nif: user.nif } });
        if (existingUserByNif) {
            return new ErrorResponse('NIF already exists');
        }

         
        const existingUserByEmail = await this.userRepository.findOne({ where: { email: user.email } });
        if (existingUserByEmail) {
            return new ErrorResponse('Email already exists');
        }

         
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(email: string): Promise<User | ErrorResponse> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return new ErrorResponse('User not found');
        }
        return user;
    }

    async findOneById(id: number): Promise<User | ErrorResponse> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return new ErrorResponse('User not found');
        }
        return user;
    }

    async chargeBalance(id: number, amount: number): Promise<User | ErrorResponse> {
        if (amount <= 0 || isNaN(amount)) {
            return new ErrorResponse('Invalid amount');
        }

        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return new ErrorResponse('User not found');
        }

        
        if (isNaN(user.balance)) {
            return new ErrorResponse('User balance is not valid');
        }
        const t = user.balance + amount
        user.balance = t;
        return this.userRepository.save(user);
    }
}
