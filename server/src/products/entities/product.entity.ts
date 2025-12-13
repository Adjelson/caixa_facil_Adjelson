import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Category } from "./category.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  barcode: string; // Critical for POS

  @Index({ unique: true })
  @Column({ nullable: true })
  sku?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number; // Selling price

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  costPrice: number; // For profit calculation

  @Column("int", { default: 0 })
  stock: number; // Current stock level

  @Column("int", { default: 5 })
  minStock: number; // Alert level

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column({ nullable: true })
  categoryId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
