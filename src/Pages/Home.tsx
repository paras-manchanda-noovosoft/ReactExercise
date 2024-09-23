import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {IProduct} from "../Types/ProductTypes";
import Product from "../Components/Product";
import CartStore, {ICartType} from "../Stores/CartStore";
import {ProductStore} from "../Stores/ProductStore";
import {UserStore} from "../Stores/UserStore";
import {CategoryStore} from "../Stores/CategoryStore";
import CategoryDropDown from "../Components/CategoryDropDown";
import {useRouterStore} from 'mobx-state-router';
import PostPage from "./PostPage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


export const Home = observer(({productStore, userStore, categoryStore, cartStore}: {
    productStore: ProductStore,
    userStore: UserStore,
    categoryStore: CategoryStore,
    cartStore: CartStore
}) => {
    const routerStore = useRouterStore();
    const redirectAddPage = () => {
      routerStore.goTo('NewProductPage').then();
    }
    const redirectGridPage = () => {
        routerStore.goTo('GridExercisePage').then();
    }
    const redirectPostPage=()=>{
        routerStore.goTo('PostPage').then();
    }
    const deleteProduct = async (id: number) => {
        if (cartStore.cartStoreDetails.some((item: ICartType) => item.productDetail.id === id)) {
            cartStore.deleteFromCart(id);
        }

        try {
            const data = await productStore.fetchProductDetails("");
            let products = JSON.parse(localStorage.getItem("products") || "[]");

            if (data) {
                const productIndex = data.findIndex((product) => product.id === id);

                if (productIndex > -1) {
                    const product = data[productIndex];
                    product.isDeleted = true;
                    products.push(product);
                } else {
                    products = products.filter((product: any) => product.id !== id);
                }
                localStorage.setItem('products', JSON.stringify(products));
            }

            productStore.productDetails = productStore.productDetails.filter((product) => product.id !== id);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleUpdateProduct = () => {

    }

    const handleCategoryChange = (str: string) => {
        if (str === "all") {
            productStore.setProductDetails("", 0).then();
        } else {
            productStore.setProductDetails(str, 1).then();
        }

    }

    const handleSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        productStore.setSearchData(e.target.value);
    }



    useEffect(() => {
        if (productStore.search?.length > 0) {
            const timer: any = setTimeout(() => {
                productStore.searchData();
            }, 2000);

            return () => {
                clearTimeout(timer)
            }
        }

    }, [productStore.search]);


    useEffect(() => {
        userStore.setUserDetails().then();
        categoryStore.setCategoryDetails().then();
    }, []);

    useEffect(() => {
        productStore.setProductDetails("", 0).then();
    }, [productStore]);

    return (
        <>
            <header className="search-bar">
                <input type="text" placeholder="Search ..." className="search-box" onChange={handleSearchData}/>
                {categoryStore.categoryList &&
                    <CategoryDropDown categoryData={categoryStore.categoryList} onSelect={handleCategoryChange}/>}
                <div className="user-cart">
                    <p>{userStore.user}</p>
                    <button onClick={() => routerStore.goTo('CartPage')}><FontAwesomeIcon className="cart-icon" icon={faCartShopping} />
                        {cartStore.cartStoreDetails.length}  </button>
                </div>
            </header>

            <div className="flex-container-justify-right">
                <button className="primary-button" onClick={redirectGridPage}> Grid Page</button>
                <button className="primary-button" onClick={redirectPostPage}> Post Page</button>
                <button className={"primary-button"} onClick={redirectAddPage}>Add Product
                </button>
            </div>
            <div>
                <h1 style={{textAlign: "center", fontSize: "1.3rem"}}>Product List</h1>
                {productStore.productDetails?.length === 0 ? (
                    <p>Loading products...</p>
                ) : (
                    productStore.productDetails.map((product: IProduct) => (
                        <Product key={product.id} product={product} cartStore={cartStore} deleteProduct={deleteProduct}
                                 updateProduct={handleUpdateProduct}
                        />
                    ))
                )}
            </div>
        </>
    )
})