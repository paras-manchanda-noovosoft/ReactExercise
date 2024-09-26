import { action, observable, makeAutoObservable } from "mobx";

export class UserStore {
    @observable user: string = "";

    constructor() {
        makeAutoObservable(this);
        this.loadUserFromLocalStorage();
    }

    @action
    async setUserDetails() {
        try {
            const userData = await fetch('https://dummyjson.com/users/1');
            const data = await userData.json();
            this.user = `${data.firstName} ${data.lastName}`;
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
