import { IsInt, IsNotEmpty, IsUUID, Min } from "class-validator";

export class CreateOrderDto{

    @IsUUID()
    @IsNotEmpty()
    product_id:string;

    @IsInt()
    @IsNotEmpty()
    @Min(1)
    quantity:number;
}