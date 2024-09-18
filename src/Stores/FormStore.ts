import {action, makeAutoObservable, observable} from "mobx";

interface IValidate {
    required: boolean
}

export class FormStore {
    @observable data: { [key: string]: any } = {};
    @observable errors: { [key: string]: string } = {};
    @observable validateFields: { [key: string]: IValidate } = {};
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

    @action validateField(fieldName: string, value: any, validate: IValidate) {

        let errorMessage: string | null = null;

        switch (typeof value) {
            case 'string':
                if (!value) {
                    errorMessage = 'This is required !!!';
                }
                break;
            case 'number':
                if (value <= 0) {
                    errorMessage = 'This should be greater than zero !!!';
                }
                break;
            case 'object':
                if (Array.isArray(value)) {
                    if (value.length === 0 || value.some(item => item.length === 0)) {
                        errorMessage = 'This is required !!!';
                    }
                }
                break;
            default:
                break;
        }

        if (errorMessage) {
            this.errors[fieldName] = errorMessage;
        }
    }

    @action validate() {
        this.errors = {}
        for (const key in this.data) {
            if (this.validateFields[key]) {
                this.validateField(key, this.data[key], this.validateFields[key]);
            }
        }

        return !Object.keys(this.errors).length
    }
}