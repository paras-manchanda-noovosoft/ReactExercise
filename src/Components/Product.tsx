import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {IProduct} from "../Types/ProductTypes";
import {ICartType} from "../Stores/CartStore";
import { action} from "mobx";
import {RootContext} from "../context/RouterContext";
import CommonProduct from "./CommonProduct";
import QuantityWidget from "./QuantityWidgets";

interface IProductProps {
    product: IProduct;
    cartStore: any;
    deleteProduct: (a: number) => void;
}

@observer
class Product extends Component<IProductProps> {
    static contextType = RootContext;
    context!: React.ContextType<typeof RootContext>;
    routerStore: any;

    constructor(props: IProductProps) {
        super(props);
    }

    componentDidMount() {
        this.routerStore = this.context.routerStore;
    }

    @action handleAddCart = () => {
        this.props.cartStore.addToCart(this.props.product);
    }
    @action deleteFromProduct = () => {
        this.props.deleteProduct(this.props.product.id);
    }

    @action updateFromProduct = () => {
        this.routerStore.goTo('NewProductPage', {
            params: {productId: this.props.product.id.toString()}
        }).then();
    }


    render() {
        const {product, cartStore} = this.props;

        return (
            <div className="product-item column-direction">
                <CommonProduct product={product}/>

                {cartStore.cartStoreDetails.some((item: ICartType) => item.id === product.id) ? (
                    <QuantityWidget
                        cartStore={cartStore}
                        id={product.id}
                    />
                ) : (
                    <button className="primary-button" onClick={this.handleAddCart}>
                        Add to Cart
                    </button>
                )}

                <div className="edit-product-order top-right-action-buttons">
                    <button className="secondary-button" style={{margin: "0 0.7rem"}} onClick={this.updateFromProduct}>
                        Edit
                    </button>
                    <button className="tertiary-button" onClick={this.deleteFromProduct}>Delete</button>
                </div>
            </div>
        );
    }
}

export default Product;
