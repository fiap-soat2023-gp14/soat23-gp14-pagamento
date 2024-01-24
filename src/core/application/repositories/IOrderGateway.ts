import { CPF } from "src/core/domain/valueObjects/Cpf";
import { Money } from "src/core/domain/valueObjects/Money";

export interface IOrderGateway {
    updateOrder(order: IOrderUpdate, oauthToken: string): Promise<IOrder>
}

export type OrderStatus = 'RECEIVED' | 'PAID' | 'CANCELLED' | 'IN_PREPARATION' | 'READY_FOR_DELIVERY' | 'FINISHED'
export interface IOrderUpdate {
    id: string
    status: OrderStatus
}
export interface IOrder {
    id: string;
    status: OrderStatus
    items: Array<ProductItem>;
    customer: User
    total: Money;
    extraItems: string;
    createdAt: Date;
    deliveredAt: Date;
}

interface ProductItem {
    product: {
        id: string
        name: string
        description: string
        imageUrl: string
        price: Money
        createdAt: Date
        category: string
    }
    observation: string
    quantity: number
}

interface User {
    id: string;
    name: string;
    email: string;
    cpf: CPF;
    phone: string;
    createdAt: Date;
    updatedAt?: Date;
}