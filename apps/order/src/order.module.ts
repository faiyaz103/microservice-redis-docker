import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ProductEntity } from 'apps/product/src/entities/product.entity';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env'
        }),
        TypeOrmModule.forFeature([
            OrderEntity,
            ProductEntity
        ])
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
