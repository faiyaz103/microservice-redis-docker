import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class ProductEntity{
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'varchar', length:100})
    title:string;

    @Column({type:'numeric', scale:2, precision:10})
    price:number;

    @Column({type:'int', default:0})
    quantity:number;
}