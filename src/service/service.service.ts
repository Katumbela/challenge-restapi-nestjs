import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { User } from '../user/user.entity';
import { ServiceResponseDto } from './dto/service.dto.response';
import { UserResponseDto } from 'src/user/dto/user.dto.response';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
    ) { }

    async create(service: Service, user: User): Promise<ServiceResponseDto> {
        if (user.userType !== 'provider') {
            throw new UnauthorizedException('Only providers can create services. Please create a provider account.');
        }
        service.provider = user;
        const createdService = await this.serviceRepository.save(service);
        return this.toServiceResponseDto(createdService);
    }

    async findAll(): Promise<ServiceResponseDto[]> {
        const services = await this.serviceRepository.find({ relations: ['provider'] });
        return services.map(service => this.toServiceResponseDto(service));  // Usa a função de flecha para garantir o contexto correto
    }


    async update(id: number, updatedService: Partial<Service>, user: User): Promise<ServiceResponseDto> {
        const service = await this.serviceRepository.findOne({ where: { id }, relations: ['provider'] });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        if (service.provider.id !== user.id) {
            throw new UnauthorizedException('You do not have permission to update this service');
        }

        Object.assign(service, updatedService);
        const updatedServiceResult = await this.serviceRepository.save(service);
        return this.toServiceResponseDto(updatedServiceResult);
    }

    async delete(id: number, user: User): Promise<void> {
        const service = await this.serviceRepository.findOne({ where: { id }, relations: ['provider'] });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        if (service.provider.id !== user.id) {
            throw new UnauthorizedException('You do not have permission to delete this service');
        }

        await this.serviceRepository.remove(service);
    }

    private toServiceResponseDto(service: Service): ServiceResponseDto {
        const dto = new ServiceResponseDto();
        dto.id = service.id;
        dto.title = service.title;
        dto.description = service.description;
        dto.price = service.price;
        dto.provider = this.toUserResponseDto(service.provider);
        return dto;
    }

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
