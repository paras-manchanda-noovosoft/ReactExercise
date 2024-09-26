import { action, observable, makeAutoObservable } from "mobx";
import {ApiService} from "../Api/ApiService";


export class UserStore {
    @observable user: string = "";
    apiService = new ApiService();

    constructor() {
        makeAutoObservable(this);
        this.loadUserFromLocalStorage();
    }

    @action
    async setUserDetails() {
        try {
            const userData = await this.apiService.get('https://dummyjson.com/users/1');
            this.user = `${userData.firstName} ${userData.lastName}`;
            localStorage.setItem('user', this.user);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    @action
    loadUserFromLocalStorage() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = storedUser;
        }
    }
}
