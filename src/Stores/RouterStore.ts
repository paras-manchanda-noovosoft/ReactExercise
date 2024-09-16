import {browserHistory, createRouterState, HistoryAdapter,RouterStore} from 'mobx-state-router';

const notFound = createRouterState('notFound');
const routes = [
    {
        name: 'HomePage',
        pattern: '/',
    },
    {
        name: 'CartPage',
        pattern: '/cart',
    },
    {
        name: 'NewProductPage',
        pattern: '/new-product-page/:productId?',
    }
];

export function initRouter() {
    const routerStore = new RouterStore(routes, notFound);
    const historyAdapter = new HistoryAdapter(routerStore, browserHistory);
    historyAdapter.observeRouterStateChanges();

    return routerStore;
}
