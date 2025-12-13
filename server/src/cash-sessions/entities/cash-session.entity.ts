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
import { CashMovement } from "./cash-movement.entity";

export enum SessionStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

@Entity("cash_sessions")
export class CashSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  userId: number;

  @Column({
    type: "enum",
    enum: SessionStatus,
    default: SessionStatus.OPEN,
  })
  status: SessionStatus;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  openingBalance: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  closingBalance?: number;

  @Column({ nullable: true })
  notes?: string;

  @OneToMany(() => CashMovement, (movement) => movement.session)
  movements: CashMovement[];

  @CreateDateColumn()
  openedAt: Date;

  @Column({ nullable: true })
  closedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
