import { Service } from "src/service/service.entity";
import { Transaction } from "typeorm";

export class UserDto {
    id: number;
    fullName: string;
    nif: string;
    email: string;
    userType: "client" | "provider";
    balance: number;
    transactions: Transaction[];
    providedTransactions: Transaction[];
    services: Service[];
}
