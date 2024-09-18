import React from "react";
import withHOCField from "../Components/FieldComponent";

class WrappedRadioField extends React.Component<any> {
    render() {
        const {name, options, onChange} = this.props;

        return (
            <div>
                {options.map((option: string, index: number) => (
                    <div key={index}>
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            onChange={onChange}
                        />
                        <span>{option}</span>
                    </div>
                ))}
            </div>
        );
    }
}

export const RadioField = withHOCField(WrappedRadioField);
