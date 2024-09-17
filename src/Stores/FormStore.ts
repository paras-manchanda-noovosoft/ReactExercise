import {action, makeAutoObservable, observable} from "mobx";

export class FormStore {
    @observable data: { [key: string]: any } = {};
    @observable errors: { [key: string]: string } = {};
    @observable validateFields: { [key: string]: boolean } = {};
    initialData: { [key: string]: any } = {};

    constructor(data: any) {
        for (let key of Object.keys(data)) {
            this.initialData[key] = data[key];
            this.data[key] = data[key];
        }
        makeAutoObservable(this);
    }

    @action reset() {
        for (let key in this.initialData) {
            this.errors[key] = "";
            this.data[key] = this.initialData[key];
        }
    }

    @action setData(data: any) {
        for (let key of Object.keys(data)) {
            if (this.data.hasOwnProperty(key)) {
                this.setInputFieldValue(key, data[key]);
            }
        }
    }

    @action setInputFieldValue(name: string, value: any) {
        this.data[name] = value;
    }

    get formData(): any {
        return this.data;
    }

    @action validateField(fieldName: string, value: any) {
        if (typeof value === 'string' && !value) {
            this.errors[fieldName] = `This is required !!!`;
        } else if (typeof value === 'number' && value <= 0) {
            this.errors[fieldName] = `This should be greater than zero !!!`;
        }
    }

    @action validate() {
        this.errors = {}
        for (const key in this.data) {
            if (this.validateFields[key]) {
                this.validateField(key, this.data[key]);
            }
        }

        return !Object.keys(this.errors).length
    }
}