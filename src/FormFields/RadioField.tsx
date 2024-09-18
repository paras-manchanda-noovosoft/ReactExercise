import React from "react";
import withHOCField from "../Components/FieldComponent";
import {observer} from "mobx-react";

@observer
class WrappedRadioField extends React.Component<any> {
    render() {
        const {name, options, onChange,formStore} = this.props;
        return (
            <div>
                {options.map((option: string, index: number) => (
                    <div key={index}>
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            onChange={onChange}
                            checked={formStore.data[name] === option}
                        />
                        <span>{option}</span>
                    </div>
                ))}
            </div>
        );
    }
}

export const RadioField = withHOCField(WrappedRadioField);
