import React from "react";
import {FormStore} from "../Stores/FormStore";

interface FormProps {
    formStore : FormStore,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    showSaveButton ?: boolean,
    showResetButton ?: boolean
}

class FormComponent extends React.Component<FormProps>{
    constructor(props: FormProps) {
        super(props);
    }
    resetForm = () => {
        this.props.formStore.reset();
    };

    save=(e : any)=>{
        this.props.onSubmit(e);
    }

    render() {
        const { showSaveButton = true, showResetButton = false } = this.props;
        return (
            <>
            { showSaveButton && <button className={"secondary-button"} style={{margin: "0 0.7rem"}} onClick={this.save}> Save
                </button>}
                {showResetButton && <button className={"tertiary-button"} onClick={this.resetForm}> Reset</button>}
            </>
        )
    }
}

export default FormComponent;