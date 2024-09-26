import React from "react";
import withHOCField from "../Components/FieldComponent";
import {observer} from "mobx-react";

@observer
class WrappedNumberField extends React.Component<any> {
    render() {
        return (
            <input
                type="number"
                {...this.props}
                onWheel={ event => event.currentTarget.blur() }
            />
        );
    }
}

export const NumberField = withHOCField(WrappedNumberField);

