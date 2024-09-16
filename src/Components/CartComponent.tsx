import {observer} from 'mobx-react';
import React from 'react';
import {IProduct} from "../Types/ProductTypes";

const CartComponent = observer(({product, cartStore}: { product: IProduct, cartStore: any }) => {
    const handleDeleteCart = () => {
        cartStore.deleteFromCart(product.id);
    }
    return (
        <>
            <div className="product-item">
                <img src={product.thumbnail} alt={product.product_name} className="product-thumbnail"/>
                <div className="product-details">
                    <h4>
                        {product.product_name} (
                        {product.product_tags.map((tag, index) => (
                            <span style={{paddingLeft: '7px'}} key={index}>{tag}</span>
                        ))}
                        )
                    </h4>
                    <p>Price: ${product.discount} <span className="text-styling-gray">(${product.price})</span></p>
                    <p>Category: {product.category}</p>
                    <p>{product.description}</p>
                    <p>Rating: {product.rating}</p>
                    <button className="secondary-button" onClick={handleDeleteCart}>
                        Remove from Cart
                    </button>
                </div>
            </div>
        </>
    )
});


export default CartComponent;