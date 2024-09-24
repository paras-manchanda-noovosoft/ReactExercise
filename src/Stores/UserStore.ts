import {action, observable, makeAutoObservable} from "mobx";

export class UserStore {
    @observable user: string = "";
    @observable loading: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }


    @action
    async setUserDetails() {
        this.loading = true;
        try {
            const userData = await fetch('https://dummyjson.com/users/1');
            const data = await userData.json();
            this.user = (data.firstName + " " + data.lastName) as string;
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            this.loading = false;
        }
    }
}
