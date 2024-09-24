import React from "react";
import {FormStore} from "../Stores/FormStore";
import {observer} from "mobx-react";
import {FormContext} from "../context/FormContext";
import {action} from "mobx";

interface FieldProps {
    Component: React.ComponentType<any>;
    formStore: FormStore;
    label: string;
    name: string;
    required?: boolean;
    options?: string[];
}

@observer
class FieldComponent extends React.Component<FieldProps> {
    static contextType = FormContext;
    context!: React.ContextType<typeof FormContext>;

    constructor(props: FieldProps) {
        super(props);
    }

    @action
    get formStore() {
        return this.props.formStore || this.context;
    }

    @action handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        this.formStore.setInputFieldValue(this.props.name, e.target.value);
    };

    componentDidMount() {
        if (this.props.required) {
            this.formStore.validateFields[this.props.name] = {required: true};
        }
    }

    render() {
        const {label, name, required, Component, ...restProps} = this.props;
        const errorMessage = this.formStore.errors[name];

        return (
            <div>
                <label htmlFor={name}>
                    {label}: {required && <span style={{color: "indianred"}}>*</span>}
                </label>
                <Component
                    id={name}
                    name={name}
                    value={this.formStore.data[name] || ""}
                    onChange={this.handleChange}
                    {...restProps}
                />
                {errorMessage && <p className="red-color">{errorMessage}</p>}
            </div>
        );
    }
}

const withHOCField = (Component: React.ComponentType<any>) => {
    return (props: any) => <FieldComponent {...props} Component={Component}/>;
};

export default withHOCField;
