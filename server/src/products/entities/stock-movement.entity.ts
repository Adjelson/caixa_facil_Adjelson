import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { User } from "../../users/entities/user.entity";

export enum StockMovementType {
  IN = "IN",
  OUT = "OUT",
  ADJUST = "ADJUST",
}

@Entity("stock_movements")
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  productId: number;

  @Column({
    type: "enum",
    enum: StockMovementType,
  })
  type: StockMovementType;

  @Column("int")
  amount: number;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  referenceType?: string; // 'SALE', 'ADJUSTMENT'

  @Column({ nullable: true })
  referenceId?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: true })
  userId?: number;

  @CreateDateColumn()
  createdAt: Date;
}
