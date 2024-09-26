import { action, makeObservable, observable, toJS } from 'mobx';
import { IProduct } from "../Types/ProductTypes";
import {ApiService} from "../Api/ApiService";

export interface ICartType {
    id: number;
    quantity: number;
    product?: IProduct;
}

export default class CartStore {
    @observable cartStoreDetails: ICartType[] = [];
    apiService: ApiService;

    constructor() {
        makeObservable(this);
        this.apiService = new ApiService();
        const storedCartDetails: string | null = localStorage.getItem('cart_details');
        if (storedCartDetails) {
            this.cartStoreDetails = JSON.parse(storedCartDetails) as ICartType[];
        }
    }

    @action
    async setCartDetails({ allProducts }: { allProducts: IProduct[] }) {
        try {
            const data = await this.apiService.get('https://dummyjson.com/carts/1');
            const cartData = data.products.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                product: allProducts.find(product => product.id === item.id)
            }));

            this.cartStoreDetails = cartData;
            localStorage.setItem('cart_details', JSON.stringify(cartData));
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    @action
    addToCart(item: IProduct, quantity?: number) {
        this.cartStoreDetails.push({
            id: item.id,
            quantity: quantity || 1,
            product: item
        });
        localStorage.setItem('cart_details', JSON.stringify(this.cartStoreDetails));
    }

    @action
    updateCartQuantity(id: number, newQuantity: number) {
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

    @action
    deleteFromCart(id: number) {
        this.cartStoreDetails = this.cartStoreDetails.filter((data: ICartType) => data.id !== id);
        localStorage.setItem('cart_details', JSON.stringify(this.cartStoreDetails));
    }

    length(): number {
        return this.cartStoreDetails.length;
    }
}
