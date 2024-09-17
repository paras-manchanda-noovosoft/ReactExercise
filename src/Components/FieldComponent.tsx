import React from "react";
import { FormStore } from "../Stores/FormStore";
import { action } from "mobx";
import { observer } from "mobx-react";
import {FormContext} from "../context/FormContext";

interface FieldProps {
    formStore?: FormStore;
    label: string;
    name: string;
    required?: boolean;
    type: string;
}

@observer
class FieldComponent extends React.Component<FieldProps> {
    static contextType = FormContext;
    context!: FormStore;

    get formStore() {
        return this.props.formStore || this.context;
    }

    @action handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.formStore.setInputFieldValue(this.props.name, e.target.value);
    };

    componentDidMount() {
        if (this.props.required) {
            this.formStore.validateFields[this.props.name] = true;
        }
    }

    render() {
        const { label, name, required, type } = this.props;
        const errorMessage = this.formStore.errors[name];

        return (
            <div>
                <label htmlFor={name}>
                    {label}: {required && <span style={{ color: 'indianred' }}>*</span>}
                </label>
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={this.formStore.data[name] || ""}
                    onChange={this.handleChange}
                />
                {errorMessage && (
                    <p className="red-color">{errorMessage}</p>
                )}
            </div>
        );
    }
}

export default FieldComponent;
