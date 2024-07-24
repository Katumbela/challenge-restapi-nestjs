import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
    ) { }

    async create(service: Service, user: User): Promise<Service> {
        if (user.userType !== 'provider') {
            throw new UnauthorizedException('Only providers can create services. Please create a provider account.');
        }
        service.provider = user;
        return this.serviceRepository.save(service);
    }

    async findAll(): Promise<Service[]> {
        return this.serviceRepository.find({ relations: ['provider'] });
    }

    async update(id: number, updatedService: Partial<Service>, user: User): Promise<Service> {
        const service = await this.serviceRepository.findOne({ where: { id }, relations: ['provider'] });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        if (service.provider.id !== user.id) {
            throw new UnauthorizedException('You do not have permission to update this service');
        }

        Object.assign(service, updatedService);
        return this.serviceRepository.save(service);
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
}
