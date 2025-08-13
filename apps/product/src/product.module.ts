import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductEventController } from './product-event.controller';
import { RedisCacheModule } from '@app/redis-cache';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        DatabaseModule,

        RedisCacheModule,

        // CacheModule,

        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env'
        }),

        TypeOrmModule.forFeature([
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
    controllers: [ProductController, ProductEventController],
    providers: [ProductService],
})
export class ProductModule {}
