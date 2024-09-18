import React from "react";
import withHOCField from "../Components/FieldComponent";

class WrappedTextArea extends React.Component {
    render() {
        return (
            <textarea className="textarea-box"
                      {...this.props}
            />
        );
    }
}

export const TextAreaField = withHOCField(WrappedTextArea);

