import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateProductDto{
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title:string;

    @IsNumber()
    @IsNotEmpty()
    price:number;

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    quantity:number;


}