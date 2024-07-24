 
import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/user/dto/user.dto.response';

export class TransactionResponseDto {
    @Expose()
    id: number;

    @Expose()
    amount: number;

    @Expose()
    date: Date;

    @Expose()
    client: UserResponseDto;

    @Expose()
    provider: UserResponseDto;

    @Expose()
    serviceId: number;
}
