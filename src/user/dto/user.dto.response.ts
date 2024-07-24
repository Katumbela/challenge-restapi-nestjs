import { Expose, Exclude } from 'class-transformer';
import { User } from '../user.entity';  // Ajuste o caminho conforme necessário
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

    // Método estático para criar um DTO a partir da entidade User
    static fromEntity(user: User): UserResponseDto {
        const dto = new UserResponseDto();
        dto.id = user.id;
        dto.fullName = user.fullName;
        dto.nif = user.nif;
        dto.email = user.email;
        dto.userType = user.userType;
        dto.balance = user.balance;
        // Nota: O campo password pode ser removido se não for necessário
        return dto;
    }
}
