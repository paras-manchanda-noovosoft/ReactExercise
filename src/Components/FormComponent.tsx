import React, {createContext, ReactNode} from 'react';
import {FormContext} from '../context/FormContext';
import {FormStore} from '../Stores/FormStore';


interface FormProps {
    formStore: FormStore;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    showSaveButton?: boolean;
    showResetButton?: boolean;
    children?: ReactNode;
}

class FormComponent extends React.Component<FormProps> {
    constructor(props: FormProps) {
        super(props);
    }
    resetForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        this.props.formStore.reset();
    };

    render() {
        const {formStore, showSaveButton = true, showResetButton = false, onSubmit, children} = this.props;
        return (
            <FormContext.Provider value={formStore}>
                <form onSubmit={onSubmit}>
                    {children}
                    {showSaveButton && (
                        <button
                            type="submit"
                            className={"secondary-button"}
                            style={{margin: "0 0.7rem"}}
                        >
                            Save
                        </button>
                    )}
                    {showResetButton && (
                        <button
                            type="button"
                            className={"tertiary-button"}
                            onClick={this.resetForm}
                        >
                            Reset
                        </button>
                    )}
                </form>
            </FormContext.Provider>
        );
    }
}

export default FormComponent;
