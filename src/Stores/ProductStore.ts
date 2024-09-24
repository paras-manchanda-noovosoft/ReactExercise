import {IFetchProductData, IProduct} from "../Types/ProductTypes";
import {action, observable, makeAutoObservable} from "mobx";

export class ProductStore {
    baseUrl: string = 'https://dummyjson.com/products';
    @observable search = "";
    @observable category = "";
    @observable productDetails: IProduct[] = [];
    @observable loading: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    @action
    async fetchProductDetails(category?: string, search?: string) {
        this.loading = true;
        let fetchUrl: string;

        if (search) {
            fetchUrl = `${this.baseUrl}/search?q=${search}`;
        } else {
            fetchUrl = `${this.baseUrl}?limit=0`;
        }

        try {
            const response = await fetch(fetchUrl, {method: 'GET'});
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const productData = await response.json();
            let allSearchProducts: IProduct[] = productData["products"].map((data: IFetchProductData) => ({
                product_name: data.title,
                product_tags: data.tags,
                description: data.description,
                category: data.category,
                price: data.price,
                discount: data.discountPercentage,
                thumbnail: data.thumbnail,
                rating: data.rating,
                id: data.id,
                isDeleted: false
            }));

            if (category) {
                allSearchProducts = allSearchProducts.filter(product => product.category === category);
            }

            return allSearchProducts;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        } finally {
            this.loading = false;
        }
    }

    @action
    async setProductDetails(category?: string, search?: string) {
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        let localStoredProducts: IProduct[] = products.filter((product: IProduct) => !product.isDeleted);

        if (category && category !== 'all') {
            localStoredProducts = localStoredProducts.filter((product: IProduct) => product.category === category);
        }

        try {
            const apiResponse = await this.fetchProductDetails(category === 'all' ? undefined : category, search);
            const apiProducts: IProduct[] = apiResponse.filter((product: IProduct) =>
                !localStoredProducts.some((localProduct: IProduct) => localProduct.id === product.id)
            );

            this.productDetails = [...localStoredProducts, ...apiProducts];
        } catch (e) {
            console.error(e);
        }
    }

    @action
    setSearchData(str: string): void {
        this.search = str;
        this.setProductDetails(this.category, str).then();
    }

    @action
    setCategory(str: string): void {
        this.category = str;
        this.setProductDetails(str, this.search).then();
    }


    getProductById(id: string) {
        return this.productDetails.find((product: IProduct) => product.id === +id);
    }

    @action
    setAddProduct(product: IProduct) {
        this.productDetails = [product, ...this.productDetails];
        this.search = "";
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }

    @action
    updateProduct(product: IProduct) {
        const ind: number = this.productDetails.findIndex((prod: IProduct) => prod.id === product.id);
        if (ind !== -1) {
            this.productDetails[ind] = product;
        } else {
            this.productDetails.push(product);
        }
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        const index = products.findIndex((existingProduct: IProduct) => existingProduct.id === product.id);
        if (index !== -1) {
            products[index] = product;
        } else {
            products.push(product);
        }
        localStorage.setItem('products', JSON.stringify(products));
    }
}
