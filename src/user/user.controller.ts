import { Controller, Post, Get, Param, Body, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ErrorResponse } from 'src/common/error-response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user.dto.response';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() user: User): Promise<UserResponseDto | ErrorResponse> {
    const result = await this.userService.create(user);
    if (result instanceof ErrorResponse) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;  // Já é um UserResponseDto
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users;  // Já é uma lista de UserResponseDto
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  async findOne(@Param('email') email: string): Promise<UserResponseDto | ErrorResponse> {
    const result = await this.userService.findOne(email);
    if (result instanceof ErrorResponse) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }
    return result;  // Já é um UserResponseDto
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  async findOneById(@Param('id') id: number): Promise<UserResponseDto | ErrorResponse> {
    const result = await this.userService.findOneById(id);
    if (result instanceof ErrorResponse) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }
    return result;  // Já é um UserResponseDto
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/charge')
  async chargeBalance(
    @Param('id') id: number,
    @Body('amount') amount: string,
  ): Promise<UserResponseDto | ErrorResponse> {
    const amountInDecimal = parseFloat(amount);
    if (isNaN(amountInDecimal) || amountInDecimal <= 0) {
      throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
    }

    const result = await this.userService.chargeBalance(id, amountInDecimal);
    if (result instanceof ErrorResponse) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;  // Já é um UserResponseDto
  }
}
