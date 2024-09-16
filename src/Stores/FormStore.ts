import { action, makeAutoObservable, observable } from "mobx";

export class FormStore {
    @observable data: { [key: string]: any } = {};
    @observable errors: { [key: string]: string } = {};
    @observable validateFields : {[key:string] : boolean}={};
    private initialData: { [key: string]: any } = {};

    constructor(instance: any) {
        this.setData(instance);
        for (let key of Object.keys(instance)) {
            if (instance.hasOwnProperty(key)) {
                this.initialData[key]=instance[key];
            }
        }
        makeAutoObservable(this);
    }

    @action reset(){
        for (let key in this.initialData) {
            this.data[key] = this.initialData[key];
        }
    }

    @action setData(instance: any) {
        for (let key of Object.keys(instance)) {
            if (instance.hasOwnProperty(key)) {
                this.setInputFieldValue(key,instance[key]);
            }
            this.validateFields[key]=false;
        }
    }

    @action setInputFieldValue(name: string, value: any) {
        this.data[name] = value;
    }

    get formData() : any{
        return this.data;
    }

    @action validateField(fieldName: string,value : any) {
        if(typeof value === 'string' && value.length === 0){
            this.errors[fieldName]=`${fieldName} is required !!!`;
        }
        else if(typeof  value === 'number' && value <=0){
                this.errors[fieldName]=`${fieldName} should be greater than zero !!!`;
        }
        else{
            this.errors[fieldName]="";
        }
    }

    @action validate() {
        for(const key in this.data){
            if(this.validateFields[key]){
                this.validateField(key,this.data[key]);
            }
        }

        for(let keys in this.errors){
            if(this.errors[keys].length > 0){
                return false;
            }
        }
        return true;
    }
}