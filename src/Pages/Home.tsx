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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCartShopping} from '@fortawesome/free-solid-svg-icons';

export const Home = observer(({productStore, userStore, categoryStore, cartStore}: {
    productStore: ProductStore,
    userStore: UserStore,
    categoryStore: CategoryStore,
    cartStore: CartStore
}) => {

    let timer: any = null;
    const routerStore = useRouterStore();

    const redirectAddPage = () => {
        routerStore.goTo('NewProductPage').then();
    }
    const redirectGridPage = () => {
        routerStore.goTo('GridExercisePage').then();
    }
    const redirectPostPage = () => {
        routerStore.goTo('PostPage').then();
    }

    const deleteProduct = async (id: number) => {
        if (cartStore.cartStoreDetails.some((item: ICartType) => item.id === id)) {
            cartStore.deleteFromCart(id);
        }

        try {
            let products = JSON.parse(localStorage.getItem("products") || "[]");
            if (products.some((product: IProduct) => product.id === id)) {
                products = products.filter((product: IProduct) => product.id !== id);
            }
            const prod = productStore.getProductById(id.toString());
            if (prod) {
                prod.isDeleted = true;
                products.push(prod);
            }


            localStorage.setItem("products", JSON.stringify(products));
            productStore.productDetails = productStore.productDetails.filter((product) => product.id !== id);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleCategoryChange = (category: string) => {
        productStore.setCategory(category);
    }

    const handleSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(async () => {
            productStore.setSearchData(value);
        }, 1000);
    };

    useEffect(() => {
        productStore.search = "";
        productStore.category="all";
        const fetchData = async () => {

            await userStore.setUserDetails();
            await categoryStore.setCategoryDetails();
            await productStore.setProductDetails();
        };

        const loadCartDetails = async () => {
            await fetchData();

            const localCartDetails = JSON.parse(localStorage.getItem('cart_details') as string) || [];
            if (localCartDetails.length === 0) {
                await cartStore.setCartDetails({ allProducts: productStore.productDetails });
            }
        };

        loadCartDetails().then();
    }, []);


    return (
        <>
            <header className="search-bar">
                <input
                    type="text"
                    placeholder="Search ..."
                    className="search-box"
                    onChange={handleSearchData}
                />
                {categoryStore.categoryList &&
                    <CategoryDropDown categoryData={categoryStore.categoryList} onSelect={handleCategoryChange}/>}
                <div className="user-cart">
                    <p>{userStore.user}</p>
                    <button onClick={() => routerStore.goTo('CartPage')}>
                        <FontAwesomeIcon className="cart-icon" icon={faCartShopping}/>
                        {cartStore.cartStoreDetails.length}
                    </button>
                </div>
            </header>

            <div className="flex-container-justify-right">
                <button className="primary-button" onClick={redirectGridPage}> Grid Page</button>
                <button className="primary-button" onClick={redirectPostPage}> Post Page</button>
                <button className="primary-button" onClick={redirectAddPage}>Add Product</button>
            </div>

            <div>
                <div className="three-column-grid">
                    {productStore.productDetails.length === 0 ? (

                        productStore.search.length > 0 || productStore.category.length > 0 ? (
                            <div className="center-screen">
                                <p>No products Found.</p>
                            </div>
                        ) : (

                            <div className="center-screen">
                                <p>Loading Products .... </p>
                            </div>
                        )
                    ) : (
                        productStore.productDetails.map((product: IProduct) => (
                            <Product key={product.id} product={product} cartStore={cartStore}
                                     deleteProduct={deleteProduct}/>
                        ))
                    )}

                </div>
            </div>
        </>
    );
});
