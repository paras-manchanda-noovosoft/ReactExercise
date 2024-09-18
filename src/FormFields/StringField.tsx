import React from "react";
import withHOCField from "../Components/FieldComponent";

class WrappedTextField extends React.Component<any> {
    render() {
        return (
            <input
                type="text"
                {...this.props}
            />
        );
    }
}

export const StringField = withHOCField(WrappedTextField);

