import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UserResponseDto } from './dto/user.dto.response';
import { ErrorResponse } from 'src/common/error-response';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(user: User): Promise<UserResponseDto | ErrorResponse> {
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

        const savedUser = await this.userRepository.save(user);
        return UserResponseDto.fromEntity(savedUser); 
    }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find();
        return users.map(user => UserResponseDto.fromEntity(user)); 
    }

    async findOne(email: string): Promise<UserResponseDto | ErrorResponse> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return new ErrorResponse('User not found');
        }
        return UserResponseDto.fromEntity(user);  
    }

    async findOneById(id: number): Promise<UserResponseDto | ErrorResponse> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return new ErrorResponse('User not found');
        }
        return UserResponseDto.fromEntity(user);  
    }

    async chargeBalance(id: number, amount: number): Promise<UserResponseDto | ErrorResponse> {
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
        const t = user.balance + amount;
        user.balance = t;
        const updatedUser = await this.userRepository.save(user);
        return UserResponseDto.fromEntity(updatedUser);  
    }
}
