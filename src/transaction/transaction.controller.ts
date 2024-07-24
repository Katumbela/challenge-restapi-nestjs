import { Controller, Post, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { TransactionResponseDto } from './dto/transaction.response.dto';
import { ErrorResponse } from 'src/common/error-response';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':serviceId')
    async createTransaction(@Param('serviceId') serviceId: number, @Request() req): Promise<TransactionResponseDto | ErrorResponse> {
        return this.transactionService.createTransaction(req.user.id, serviceId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('history')
    async getTransactionHistory(@Query('userId') userId: number): Promise<TransactionResponseDto[]> {
        return this.transactionService.getTransactionHistory(userId);
    }
}
