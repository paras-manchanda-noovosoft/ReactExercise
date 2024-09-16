import {makeObservable, observable, toJS} from 'mobx';
import {IProduct} from "../Types/ProductTypes";

export interface ICartType {
    productDetail: IProduct,
    isCart: boolean
}

export default class Cartstore {
    @observable cartStoreDetails: ICartType[] = [];

    constructor() {
        makeObservable(this);
        const storedCartDetails: string | null = localStorage.getItem('cart_details');

        if (storedCartDetails) {
            this.cartStoreDetails = JSON.parse(storedCartDetails) as ICartType[];
        }
    }

    addToCart(item: IProduct) {
        this.cartStoreDetails.push(
            {
                productDetail: item,
                isCart: true
            });
        localStorage.setItem('cart_details', JSON.stringify(this.cartStoreDetails));
    }

    get cartDetails(): ICartType[] {
        return toJS(this.cartStoreDetails);
    }

    deleteFromCart(id: number) {
        this.cartStoreDetails = this.cartStoreDetails.filter((data: ICartType) => data["productDetail"].id !== id);
        localStorage.setItem('cart_details', JSON.stringify(this.cartStoreDetails));
    }

    length(): number {
        return this.cartStoreDetails.length;
    }
}

