import React from "react";
import withHOCField from "../Components/FieldComponent";
import {observer} from "mobx-react";

@observer
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

