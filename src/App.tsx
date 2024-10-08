import React from 'react';
import './App.css';
import {observer} from "mobx-react";
import {RouterContext, RouterView} from 'mobx-state-router';
import {initRouter} from './Stores/RouterStore';
import {ProductStore} from "./Stores/ProductStore";
import Cartstore from "./Stores/CartStore";
import {UserStore} from "./Stores/UserStore";
import {CategoryStore} from "./Stores/CategoryStore";
import Cart from "./Pages/Cart";
import {Home} from "./Pages/Home";
import {NewProduct} from './Pages/NewProduct';
import PostPage from "./Pages/PostPage";
import GridExercisePage from './Pages/GridExercisePage';
import {ApiService} from "./Api/ApiService";

const productStore = new ProductStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const cartStore = new Cartstore();
const apiService=new ApiService();

export const viewMap = {
    CartPage: <Cart cartStore={cartStore} userStore={userStore}/>,
    HomePage: <Home productStore={productStore} userStore={userStore} categoryStore={categoryStore}
                    cartStore={cartStore}/>,
    NewProductPage: <NewProduct productStore={productStore} categoryStore={categoryStore}/>,
    PostPage: <PostPage/>,
    GridExercisePage: <GridExercisePage productStore={productStore}/>
};

const App = observer(() => {

    const routerStore = initRouter();
    return (
        <RouterContext.Provider value={routerStore}>
            <RouterView viewMap={viewMap}/>
        </RouterContext.Provider>
    );
});

export default App;