import {observer} from 'mobx-react';
import React from 'react';
import {IProduct} from "../Types/ProductTypes";
import {ICartType} from "../Stores/CartStore";
import {useRouterStore} from "mobx-state-router";

const Product = observer(({product, cartStore, deleteProduct, updateProduct}: {
    product: IProduct,
    cartStore: any,
    deleteProduct: (a: number) => void,
    updateProduct: (a: number) => void
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
        routerStore.goTo('NewProductPage', {params: {productId: product.id.toString()}});
    }

    return (
        <>
            <div className="product-item">
                <img src={product.thumbnail ?? ""} alt={product.product_name} className="product-thumbnail"/>
                <div className="product-details">
                    <h4>
                        {product.product_name} (
                        {product.product_tags.length > 0 && product.product_tags.map((tag: string, index: number) => (
                            <span className="light-small-text" style={{paddingLeft: '0.6rem'}} key={index}>{tag}</span>
                        ))}
                        )
                    </h4>
                    <p>Price: ${product.discount} <span className="text-styling-gray">(${product.price})</span></p>
                    <p>Category: {product.category}</p>
                    <p>{product.description}</p>
                    <p>Rating: {product.rating}</p>
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
                </div>

                <div className="edit-product-order">
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