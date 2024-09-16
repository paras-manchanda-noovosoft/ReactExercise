import React from "react";
import {FormStore} from "../Stores/FormStore";
import {action} from "mobx";
import {observer} from "mobx-react";

interface FieldProps {
    formStore: FormStore,
    label : string,
    name: string,
    required?: boolean,
    type: string
}

@observer
class FieldComponent extends React.Component<FieldProps> {
    constructor(props: FieldProps) {
        super(props);
    }

    @action handleChange=(e : React.ChangeEvent<HTMLInputElement>)=>{
        this.props.formStore.setInputFieldValue(this.props.name,e.target.value);
    }

    componentDidMount() {
            if (this.props.required) {
                this.props.formStore.validateFields[this.props.name] = true;
            }
    }

    render() {
        const { formStore, label, name, required, type } = this.props;
        const errorMessage = formStore.errors[name];

        return (
            <div>
                <label htmlFor={name}>
                    {label}: {required && <span style={{ color: 'indianred' }}>*</span>}
                </label>
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={formStore.data[name] || ""}
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