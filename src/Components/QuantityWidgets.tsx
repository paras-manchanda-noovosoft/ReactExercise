import React from 'react';
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import Cartstore, {ICartType} from "../Stores/CartStore";

interface IQuantityProps {
    cartStore: Cartstore;
    id: number;
}

@observer
class QuantityWidget extends React.Component<IQuantityProps> {

    @observable quantity = 1;

    constructor(props: IQuantityProps) {
        super(props);
        this.initializeQuantity();
    }

    @action initializeQuantity = () => {
        const storedCartDetails: string | null = localStorage.getItem('cart_details');
        if (storedCartDetails) {
            const cartDetails: ICartType[] = JSON.parse(storedCartDetails);
            const itemInCart = cartDetails.find(item => item.id === this.props.id);
            this.quantity = itemInCart ? itemInCart.quantity : 1;
        }
    };

    @action handleIncrease = () => {
        const newQuantity = this.quantity + 1;
        this.updateQuantity(newQuantity);
    };

    @action handleDecrease = () => {
        const newQuantity = this.quantity - 1;
        this.updateQuantity(newQuantity);

    };

    @action handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            this.updateQuantity(value);
        }
    };

    @action updateQuantity = (newQuantity: number) => {
        this.quantity = newQuantity;
        this.props.cartStore.updateCartQuantity(this.props.id, newQuantity);
        this.forceUpdate();
    };

    render() {
        return (
            <div className="quantity-widget">
                <button className="decrease-button" onClick={this.handleDecrease}>-</button>
                <input
                    type="number"
                    value={this.quantity}
                    className="quantity-input"
                    onChange={this.handleChange}
                />
                <button className="increase-button" onClick={this.handleIncrease}>+</button>
            </div>
        );
    }
}

export default QuantityWidget;
