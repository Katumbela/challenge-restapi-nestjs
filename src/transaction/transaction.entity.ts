
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Service } from '../service/service.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.transactions)
  client: User;

  @ManyToOne(() => User, user => user.providedTransactions)
  provider: User;

  @ManyToOne(() => Service, service => service.transactions)
  service: Service;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  date: Date;
}
