import {observer} from 'mobx-react';
import React from 'react';
import {IProduct} from "../Types/ProductTypes";
import ProductItem from "./ProductItem";
import QuantityWidget from "./QuantityWidgets";

const CartComponent = observer(({product, cartStore}: { product: IProduct, cartStore: any }) => {
    return (
        <div className="product-item column-direction">
            <ProductItem product={product}/>
            <QuantityWidget
                id={product.id}
                cartStore={cartStore}
            />
        </div>
    );
});

export default CartComponent;
