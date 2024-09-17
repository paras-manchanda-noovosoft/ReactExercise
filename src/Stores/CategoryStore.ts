import {action, makeAutoObservable, observable} from "mobx";

export class CategoryStore {
    @observable categoryList: string[] = [];
    @observable loading: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    @action
    async fetchCategoryDetails() {
        this.loading = true;
        try {
            const response = await fetch('https://dummyjson.com/products/category-list');
            return await response.json();
        } catch (error) {
            console.error("Error fetching category details:", error);
        } finally {
            this.loading = false;
        }
    }

    @action
    async setCategoryDetails() {
        try {
            const data = await this.fetchCategoryDetails();
            if (data) {
                data.splice(0, 0, 'all');
                this.categoryList = data;
            }
        } catch (e) {
            console.log(e);
        }
    }
}
