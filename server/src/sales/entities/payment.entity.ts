import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Sale } from "./sale.entity";

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  PIX = "PIX",
  TRANSFER = "TRANSFER",
}

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.payments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sale_id" })
  sale: Sale;

  @Column()
  saleId: number;

  @Column({
    type: "enum",
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
