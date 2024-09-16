import { action, observable, makeAutoObservable } from "mobx";

export class UserStore {
    @observable user: string = "";
    @observable loading: boolean = true;  // Add loading state

    constructor() {
        makeAutoObservable(this);
    }

    @action async setUserDetails() {
        this.loading = true;
        try {
            const userData = await new Promise(resolve =>
                setTimeout(() => resolve("John Doe"), 1000)
            );
            this.user = userData as string;
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            this.loading = false;
        }
    }
}
