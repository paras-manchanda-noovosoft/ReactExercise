import React from 'react';
import CartComponent from "../Components/CartComponent";
import {observer} from "mobx-react";
import Cartstore, {ICartType} from "../Stores/CartStore";
import {useRouterStore} from "mobx-state-router";
import {UserStore} from "../Stores/UserStore";

const Cart = observer(({cartStore, userStore}: { cartStore: Cartstore, userStore: UserStore }) => {
    const cartLength: number = cartStore.length();
    const cartProduct: ICartType[] = cartStore.cartDetails;
    const routerStore = useRouterStore();

    return (
        <>
            <div className="user-cart-page">
                <h1 className="cart-title"> Items Selected By the user {userStore.user}</h1>
                <button className="go-back-from-cart" onClick={() => routerStore.goTo('HomePage')}>Go back</button>
            </div>
            {cartLength === 0 ? (
                <p style={{textAlign: "center"}}>There are no items to display</p>
            ) : (
                cartProduct.map((data: ICartType) => {
                    return <CartComponent product={data.productDetail} key={data.productDetail.id}
                                          cartStore={cartStore}/>
                }))
            }
        </>
    );
});

export default Cart;
