import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServiceService } from './service.service';
import { Service } from './service.entity';
import { ServiceResponseDto } from './dto/service.dto.response';

@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createServiceDto: Service, @Request() req): Promise<ServiceResponseDto> {
        return this.serviceService.create(createServiceDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<ServiceResponseDto[]> {
        return this.serviceService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateServiceDto: Partial<Service>, @Request() req): Promise<ServiceResponseDto> {
        return this.serviceService.update(id, updateServiceDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @Request() req): Promise<void> {
        return this.serviceService.delete(id, req.user);
    }
}
