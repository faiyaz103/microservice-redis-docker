import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env'
        }),
        TypeOrmModule.forFeature([
            ProductEntity
        ])
    ],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
