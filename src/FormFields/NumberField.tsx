import React from "react";
import withHOCField from "../Components/FieldComponent";

class WrappedNumberField extends React.Component<any> {
    render() {
        return (
            <input
                type="number"
                {...this.props}
            />
        );
    }
}

export const NumberField = withHOCField(WrappedNumberField);

