 
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Service } from '../service/service.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  nif: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  userType: 'client' | 'provider';

  @Column()
  balance: number;

  @OneToMany(() => Transaction, transaction => transaction.client)
  transactions: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.provider)
  providedTransactions: Transaction[];

  @OneToMany(() => Service, service => service.provider)
  services: Service[];

}
