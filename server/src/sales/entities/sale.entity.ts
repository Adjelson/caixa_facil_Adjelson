import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { CashSession } from "../../cash-sessions/entities/cash-session.entity";
import { SaleItem } from "./sale-item.entity";
import { Payment } from "./payment.entity";

export enum SaleStatus {
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

@Entity("sales")
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => CashSession)
  @JoinColumn({ name: "session_id" })
  session: CashSession;

  @Column({ nullable: true })
  sessionId?: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ nullable: true })
  discountReason?: string;

  @Column({
    type: "enum",
    enum: SaleStatus,
    default: SaleStatus.COMPLETED,
  })
  status: SaleStatus;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items: SaleItem[];

  @OneToMany(() => Payment, (payment) => payment.sale, { cascade: true })
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
