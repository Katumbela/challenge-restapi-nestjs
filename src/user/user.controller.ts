 
import { Controller, Post, Body, Param, HttpException, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ErrorResponse } from 'src/common/error-response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() user: User): Promise<User | ErrorResponse> {
    const result = await this.userService.create(user);
    if (result instanceof ErrorResponse) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }


  @UseGuards(JwtAuthGuard)
  @Get(':email')
  async findOne(@Param('email') email: string): Promise<User | ErrorResponse> {
    const result = await this.userService.findOne(email);
    if (result instanceof ErrorResponse) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  async findOneById(@Param('id') id: number): Promise<User | ErrorResponse> {
    const result = await this.userService.findOneById(id);
    if (result instanceof ErrorResponse) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }
    return result;
  }



  @UseGuards(JwtAuthGuard)
  @Post(':id/charge')
  async chargeBalance(
    @Param('id') id: number,
    @Body('amount') amount: string,  
  ): Promise<User | ErrorResponse> {
    const amountInDecimal = parseFloat(amount);   
    if (isNaN(amountInDecimal) || amountInDecimal <= 0) {
      throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
    }

    const result = await this.userService.chargeBalance(id, amountInDecimal);
    if (result instanceof ErrorResponse) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
