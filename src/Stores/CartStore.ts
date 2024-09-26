import {action, makeObservable, observable, toJS} from 'mobx';
import {IProduct} from "../Types/ProductTypes";

export interface ICartType {
    id: number;
    quantity: number;
    product?: IProduct;
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

    @action
    async setCartDetails({allProducts}: { allProducts: IProduct[] }) {
        try {
            const response = await fetch('https://dummyjson.com/carts/1');
            const data = await response.json();
            const cartData = data.products.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                product: allProducts.find(product => product.id === item.id)
            }));

            this.cartStoreDetails = cartData;
            localStorage.setItem('cart_details', JSON.stringify(cartData));
        } catch (error) {
            console.error("Error fetching cart:", error);
            return [];
        }
    }


    @action addToCart(item: IProduct, quantity?: number) {
        this.cartStoreDetails.push({
            id: item.id,
            quantity: quantity || 1,
            product: item
        });
        localStorage.setItem('cart_details', JSON.stringify(this.cartStoreDetails));
    }

    @action updateCartQuantity(id: number, newQuantity: number) {
        if (newQuantity <= 0) {
            this.cartStoreDetails = this.cartStoreDetails.filter(data => data.id !== id);
        } else {
            const item = this.cartStoreDetails.find(data => data.id === id);
            if (item) {
                item.quantity = newQuantity;
            }
        }
        localStorage.setItem('cart_details', JSON.stringify(this.cartStoreDetails));
    }

    get cartDetails(): ICartType[] {
        return toJS(this.cartStoreDetails);
    }

    deleteFromCart(id: number) {
        this.cartStoreDetails = this.cartStoreDetails.filter((data: ICartType) => data.id !== id);
        localStorage.setItem('cart_details', JSON.stringify(this.cartStoreDetails));
    }

    length(): number {
        return this.cartStoreDetails.length;
    }
}
