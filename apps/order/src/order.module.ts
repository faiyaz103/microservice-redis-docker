import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ProductEntity } from 'apps/product/src/entities/product.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisCacheModule } from '@app/redis-cache';

@Module({
    imports: [
        DatabaseModule,

        RedisCacheModule,

        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env'
        }),

        TypeOrmModule.forFeature([
            OrderEntity,
            ProductEntity
        ]),

        ClientsModule.register([
            {
                name:'PRODUCT_SERVICE',
                transport:Transport.REDIS,
                options:{
                    host:'localhost',
                    port:6379
                }
            }
        ])
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
