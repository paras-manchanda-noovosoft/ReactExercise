import {FormStore} from "../Stores/FormStore";

export interface IFieldProps {
    formStore: FormStore,
    label: string,
    name: string,
    required?: boolean,
    type: string
}