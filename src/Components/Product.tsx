import {observer} from 'mobx-react';
import React from 'react';
import {IProduct} from "../Types/ProductTypes";
import {ICartType} from "../Stores/CartStore";
import {useRouterStore} from "mobx-state-router";
import CommonProduct from "./CommonProduct";

const Product = observer(({product, cartStore, deleteProduct}: {
    product: IProduct,
    cartStore: any,
    deleteProduct: (a: number) => void
}) => {
    const routerStore = useRouterStore();
    const handleAddCart = () => {
        cartStore.addToCart(product);
    }

    const handleDeleteCart = () => {
        cartStore.deleteFromCart(product.id);
    }

    const deleteFromProduct = () => {
        deleteProduct(product.id);
    }

    const updateFromProduct = () => {
        routerStore.goTo('NewProductPage', {params: {productId: product.id.toString()}}).then();
    }

    return (
        <>
            <div className="product-item column-direction">
                <CommonProduct product={product} />
                    {cartStore.cartStoreDetails.some((item: ICartType) => item.productDetail.id === product.id) ?
                        (
                            <button className="tertiary-button" onClick={handleDeleteCart}>
                                Remove from Cart
                            </button>
                        ) : (
                            <button className="primary-button" onClick={handleAddCart}>
                                Add to Cart
                            </button>
                        )}

                <div className="edit-product-order top-right-action-buttons">
                    <button className={"secondary-button"} style={{margin: "0 0.7rem"}}
                            onClick={updateFromProduct}> Edit
                    </button>
                    <button className={"tertiary-button"} onClick={deleteFromProduct}> Delete</button>
                </div>
            </div>
        </>
    )
});

export default Product;