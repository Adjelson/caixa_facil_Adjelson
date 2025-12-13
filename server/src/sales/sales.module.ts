import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Payment } from './entities/payment.entity';
import { ProductsModule } from '../products/products.module';
import { CashSessionsModule } from '../cash-sessions/cash-sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, Payment]),
    ProductsModule,
    CashSessionsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
