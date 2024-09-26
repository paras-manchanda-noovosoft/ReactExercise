import React, {Component} from "react";
import withHOCField from "../Components/FieldComponent";
import {observer} from "mobx-react";
import {action, makeObservable, observable} from "mobx";


@observer
class WrappedDynamicField extends React.Component<any> {
    @observable fields: Array<{ id: number }> = [];
    @observable fieldId: number = 0;

    constructor(props: any) {
        super(props);
        makeObservable(this);
    }

    componentDidMount() {
        this.initializeFields();
    }


    @action initializeFields() {
        const contentArray = this.props.formStore.data[this.props.name] || [];
        this.fields = Array.from({length: contentArray.length}, (_, id) => ({id}));
        this.fieldId = contentArray.length;
    }

    @action resetFields = () => {
        this.fields = [];
        this.fieldId = 0;
        this.props.formStore.setInputFieldValue(this.props.name, []);
    };

    @action handleAdd = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const newField = {id: this.fieldId++};
        this.fields.push(newField);
        let contentArray = this.props.formStore.data[this.props.name] || [];
        contentArray.push("");
        this.props.formStore.setInputFieldValue(this.props.name, contentArray);
    };

    @action handleDelete = (e: React.MouseEvent<HTMLElement>, index: number) => {
        e.preventDefault();

        let contentArray = this.props.formStore.data[this.props.name] || [];
        if (index < contentArray.length) {
            contentArray.splice(index, 1);
            this.props.formStore.setInputFieldValue(this.props.name, contentArray);
        }

        this.fields.splice(index, 1);
    };

    @action handleChange = (index: number, value: string) => {
        const contentArray = this.props.formStore.data[this.props.name] || [];
        contentArray[index] = value;
        this.props.formStore.setInputFieldValue(this.props.name, contentArray);
    };

    render() {
        const contentArray = this.props.formStore.data[this.props.name] || [];

        return (
            <>
                {this.fields.map((field, index) => (
                    <div key={field.id} style={{display: "flex", gap: "10px"}}>
                        <div style={{flex: 1}}>
                            {React.cloneElement(this.props.inputComponent, {
                                value: contentArray[index] || "",
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(index, e.target.value),
                                label :`${this.props.inputLabel} ${index+1}`
                            })}
                            {this.props.formStore.errors[`${this.props.name}[${index}]`] && (
                                <p className="red-color">
                                    {this.props.formStore.errors[`${this.props.name}[${index}]`]}
                                </p>
                            )}
                        </div>
                        <button
                            style={{alignSelf: "center"}}
                            className="tertiary-button"
                            onClick={(e: React.MouseEvent<HTMLElement>) => this.handleDelete(e, index)}
                        >
                            Delete
                        </button>
                    </div>
                ))}

                <button className="primary-button" onClick={this.handleAdd}>
                    Add
                </button>
            </>
        );
    }
}

export const DynamicField = withHOCField(WrappedDynamicField);
