import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CashSession } from './cash-session.entity';

export enum CashMovementType {
  SALE = 'SALE',
  REFUND = 'REFUND',
  MANUAL_IN = 'MANUAL_IN',
  MANUAL_OUT = 'MANUAL_OUT',
}

@Entity('cash_movements')
export class CashMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CashSession, (session) => session.movements)
  @JoinColumn({ name: 'session_id' })
  session: CashSession;

  @Column()
  sessionId: number;

  @Column({
    type: 'enum',
    enum: CashMovementType,
  })
  type: CashMovementType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  referenceId?: number; // Sale ID

  @CreateDateColumn()
  createdAt: Date;
}
