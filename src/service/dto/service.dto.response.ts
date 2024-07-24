// src/service/dto/service-response.dto.ts
import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/user/dto/user.dto.response';

export class ServiceResponseDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    price: number;

    @Expose()
    provider: UserResponseDto;
}

