import {createContext} from "react";
import {initRouter} from "../Stores/RouterStore";

const routerStore = initRouter();
export const RootContext = createContext({
    routerStore: routerStore
});