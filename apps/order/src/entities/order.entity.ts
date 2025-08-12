import { ProductEntity } from "apps/product/src/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('orders')
export class OrderEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'uuid'})
    product_id:string;

    @ManyToOne(()=>ProductEntity, {onDelete:'CASCADE'})
    @JoinColumn({name:'product_id', referencedColumnName:'id'})
    product:ProductEntity;

    @Column({type:'int'})
    quantity:number;
}