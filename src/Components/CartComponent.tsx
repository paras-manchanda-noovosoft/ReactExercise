import {observer} from 'mobx-react';
import React from 'react';
import {IProduct} from "../Types/ProductTypes";
import CommonProduct from "./CommonProduct";

const CartComponent = observer(({product, cartStore}: { product: IProduct, cartStore: any }) => {
    const handleDeleteCart = () => {
        cartStore.deleteFromCart(product.id);
    }
    return (
        <>
            <div className="product-item">
                <CommonProduct product={product} />
                <button className="secondary-button" onClick={handleDeleteCart}>
                        Remove from Cart
                    </button>
            </div>
        </>
    )
});


export default CartComponent;