import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Sale } from "./sale.entity";
import { Product } from "../../products/entities/product.entity";

@Entity("sale_items")
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sale_id" })
  sale: Sale;

  @Column()
  saleId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  productId: number;

  @Column()
  productName: string; // Snapshot

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number; // Snapshot

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total: number;
}
