import { Controller, Post, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':serviceId')
    async createTransaction(@Param('serviceId') serviceId: number, @Request() req) {
        return this.transactionService.createTransaction(req.user.id, serviceId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('history')
    async getTransactionHistory(@Query('userId') userId: number) {
        return this.transactionService.getTransactionHistory(userId);
    }
}
