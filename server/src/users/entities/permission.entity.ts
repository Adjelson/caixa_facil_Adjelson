import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  action: string; // e.g., 'sale.cancel', 'stock.adjust'

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
