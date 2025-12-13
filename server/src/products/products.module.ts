import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product } from "./entities/product.entity";
import { Category } from "./entities/category.entity";
import { StockMovement } from "./entities/stock-movement.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, StockMovement])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
