import React from "react";
import withHOCField from "../Components/FieldComponent";

interface ISelectFieldProps {
    label: string,
    name: string,
    options: string[],
    required?: boolean,
    default: string
}

class WrappedSelectField extends React.Component<ISelectFieldProps> {
    render() {
        return (
            <select {...this.props}>
                <option value="" hidden>{this.props.default}</option>
                {this.props.options.map((data: string, index: number) => (
                    <option key={index} value={data}>
                        {data}
                    </option>
                ))}
            </select>
        );
    }
}

export const SelectField = withHOCField(WrappedSelectField);
