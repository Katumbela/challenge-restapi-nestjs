import { Expose, Exclude } from 'class-transformer';
import { User } from '../user.entity';
import { Service } from 'src/service/service.entity';
import { Transaction } from 'typeorm';

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    fullName: string;

    @Expose()
    nif: string;

    @Expose()
    email: string;

    @Expose()
    userType: 'client' | 'provider';

    @Expose()
    balance: number;

    @Exclude()
    transactions: Transaction[];

    @Exclude()
    providedTransactions: Transaction[];

    @Exclude()
    services: Service[];

    @Exclude()
    password: string;


    static fromEntity(user: User): UserResponseDto {
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
