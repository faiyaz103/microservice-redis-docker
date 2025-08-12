import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    // create new order
    @Post('create')
    async addOrder(@Body() createOrderDto:CreateOrderDto): Promise<CreateOrderDto>{
        return this.orderService.addOrder(createOrderDto);
    }

    // find all Orders
    @Get('all')
    async findOrders(): Promise<CreateOrderDto[]>{
        return this.orderService.findOrders();
    }

    // find Order by ID
    @Get(':id')
    async findOrderById(@Param('id', new ParseUUIDPipe()) id: string): Promise<CreateOrderDto>{
        return this.orderService.findOrderById(id);
    }

    // delete Order by ID
    @Delete(':id/remove')
    async deleteOrder(@Param('id', new ParseUUIDPipe()) id: string): Promise<string>{
        return this.orderService.deleteOrder(id);
    }
}
