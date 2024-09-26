import { action, makeAutoObservable, observable } from "mobx";
import {ApiService} from "../Api/ApiService";

export class CategoryStore {
    @observable categoryList: string[] = [];
    @observable loading: boolean = true;
    apiService: ApiService;

    constructor() {
        this.apiService = new ApiService();
        makeAutoObservable(this);
    }

    @action
    async fetchCategoryDetails() {
        this.loading = true;
        try {
            const response = await this.apiService.get('https://dummyjson.com/products/category-list');
            return response;
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
