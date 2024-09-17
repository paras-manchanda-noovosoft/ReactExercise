import {createContext} from "react";
import {FormStore} from "../Stores/FormStore";

export const FormContext = createContext<FormStore | null>(null);