import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale, SaleStatus } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Payment, PaymentMethod } from './entities/payment.entity';
import { Product } from '../products/entities/product.entity';
import {
  StockMovement,
  StockMovementType,
} from '../products/entities/stock-movement.entity';
import {
  CashSession,
  SessionStatus,
} from '../cash-sessions/entities/cash-session.entity';
import {
  CashMovement,
  CashMovementType,
} from '../cash-sessions/entities/cash-movement.entity';

@Injectable()
export class SalesService {
  constructor(private dataSource: DataSource) {}

  async create(createSaleDto: CreateSaleDto, userId: number) {
    if (!userId) {
      throw new BadRequestException('Utilizador não autenticado');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verify Cash Session (auto open if none)
      let session = await queryRunner.manager.findOne(CashSession, {
        where: { userId, status: SessionStatus.OPEN },
      });
      if (!session) {
        session = queryRunner.manager.create(CashSession, {
          userId,
          status: SessionStatus.OPEN,
          openingBalance: 0,
          openedAt: new Date(),
        });
        session = await queryRunner.manager.save(session);
      }

      const sale = new Sale();
      sale.userId = userId;
      sale.sessionId = session.id;
      sale.discountAmount = createSaleDto.discountAmount || 0;
      sale.discountReason = createSaleDto.discountReason;
      sale.status = SaleStatus.COMPLETED;
      sale.items = [];
      sale.payments = [];

      let calculatedTotal = 0;

      // 2. Process Items and Stock
      for (const itemDto of createSaleDto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: itemDto.productId },
        });
        if (!product)
          throw new NotFoundException(`Product ${itemDto.productId} not found`);

        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}`,
          );
        }

        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(product);

        const saleItem = new SaleItem();
        saleItem.sale = sale;
        saleItem.product = product;
        saleItem.productName = product.name;
        saleItem.quantity = itemDto.quantity;
        saleItem.price = product.price;
        saleItem.total =
          Number(product.price) * itemDto.quantity - (itemDto.discount || 0);

        calculatedTotal += saleItem.total;
        sale.items.push(saleItem);
      }

      sale.totalAmount = calculatedTotal - sale.discountAmount;

      // 3. Process Payments
      let paymentTotal = 0;
      for (const payDto of createSaleDto.payments) {
        const payment = new Payment();
        payment.sale = sale;
        payment.method = payDto.method;
        payment.amount = payDto.amount;
        sale.payments.push(payment);
        paymentTotal += Number(payDto.amount);
      }

      // Allow overpayment (troco), but block if underpaid
      if (paymentTotal + 0.001 < sale.totalAmount) {
        throw new BadRequestException(
          'Total de pagamentos inferior ao valor da venda',
        );
      }

      const savedSale = await queryRunner.manager.save(sale);

      // Stock Movements
      for (const itemDto of createSaleDto.items) {
        const stockMove = new StockMovement();
        stockMove.productId = itemDto.productId;
        stockMove.type = StockMovementType.OUT;
        stockMove.amount = -itemDto.quantity;
        stockMove.userId = userId;
        stockMove.referenceType = 'SALE';
        stockMove.referenceId = savedSale.id;
        await queryRunner.manager.save(stockMove);
      }

      // Cash Movements (only for cash payments)
      for (const pay of savedSale.payments) {
        if (pay.method === PaymentMethod.CASH) {
          const cashMove = new CashMovement();
          cashMove.sessionId = session.id;
          cashMove.type = CashMovementType.SALE;
          cashMove.amount = pay.amount;
          cashMove.referenceId = savedSale.id;
          await queryRunner.manager.save(cashMove);
        }
      }

      await queryRunner.commitTransaction();
      const completeSale = await queryRunner.manager.findOne(Sale, {
        where: { id: savedSale.id },
        relations: ['items', 'payments'],
      });
      return completeSale;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.dataSource.manager.find(Sale, {
      relations: ['items', 'payments'],
    });
  }

  async findOne(id: number) {
    return this.dataSource.manager.findOne(Sale, {
      where: { id },
      relations: ['items', 'payments'],
    });
  }
}
