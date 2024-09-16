import {IFetchProductData, IProduct} from "../Types/ProductTypes";
import {action, observable, makeAutoObservable} from "mobx";

export class ProductStore {
    baseUrl: string = 'https://dummyjson.com/products';
    @observable search = "";

    @observable productDetails: IProduct[] = [];
    @observable loading: boolean = true;  // Add loading state

    constructor() {
        makeAutoObservable(this);
    }

    @action
    async fetchProductDetails(str: string) {
        this.loading = true;  // Set loading to true before starting fetch
        const fetchUrl: string = this.baseUrl + str;
        try {
            const response = await fetch(fetchUrl, {method: 'GET'});
            const productData = await response.json();
            const productInventory: IProduct[] = productData["products"].map((data: IFetchProductData) => {
                return {
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
                };
            });

            return productInventory;
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            this.loading = false;  // Set loading to false once the fetch is complete
        }
    }

    @action
    async setProductDetails(str: string, id: number) {
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        let p : string="";

        if (id === 1) {
            p=str;
            str = "/category/" + str;
        }

        let localStoredProducts: IProduct[] = products.filter((product: IProduct) => !product.isDeleted);
        if(id === 1){
            localStoredProducts=localStoredProducts.filter((product : IProduct)=> product.category === p);
        }

        if(this.search.length > 0){
            localStoredProducts= localStoredProducts.filter((product : IProduct) => product.product_name.includes(this.search));
        }


        try {
            // eslint-disable-next-line react/no-is-mounted
            const response = await this.fetchProductDetails(str);

            if (response) {
                const apiProducts: IProduct[] = response.filter((product) => {
                    const index = products.findIndex((prod: IProduct) => product.id === prod.id);
                    return index === -1;
                });

                this.productDetails = [...localStoredProducts, ...apiProducts];
            }

        } catch (e) {
            console.log(e);
        }
    }

    @action setSearchData(str: string): void {
        this.search = str;
    }

    @action searchData(): void {
        // eslint-disable-next-line react/no-is-mounted
        this.setProductDetails("/search?q=" + this.search, 2).then();
    }

    getProductById(id: string) {

        return this.productDetails.find((product: IProduct) => product.id === +id);
    }

    @action setAddProduct(product: IProduct) {
        this.productDetails = [product, ...this.productDetails];
        this.search="";
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }

    @action updateProduct(product: IProduct) {
        const ind: number = this.productDetails.findIndex((prod: IProduct) => prod.id === product.id);
        this.productDetails[ind] = product;
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


