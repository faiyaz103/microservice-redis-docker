import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity) private orderRepo:Repository<OrderEntity>,
        @Inject('PRODUCT_SERVICE') private readonly productClient:ClientProxy,
    ){};

    // create new Order
    async addOrder(createOrderDto: CreateOrderDto): Promise<CreateOrderDto>{

        try {
            const order=this.orderRepo.create(createOrderDto);
            const savedOrder=await this.orderRepo.save(order);

            // emit event to product service to update quantity
            this.productClient.emit('update-product-quantity', {
                productId:createOrderDto.product_id,
                quantity:createOrderDto.quantity
            });

            return order;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error creating order ', error);
        }
    }

    // get Order by ID
    async findOrderById(id: string): Promise<CreateOrderDto>{

        try {
            const order=await this.orderRepo.findOne({
                where:{id}
            });

            return order as CreateOrderDto;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error fetching order ', error);
        }
    }

    // get Order by ID
    async findOrders(): Promise<CreateOrderDto[]>{

        try {
            const orders=await this.orderRepo.find();

            return orders;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error fetching orders ', error);
        }
    }

    // delete Order by ID
    async deleteOrder(id: string): Promise<string>{

        try {
            await this.orderRepo.delete(id);

            return 'Deleted successfully';
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error deleting order ', error);
        }
    }
}
