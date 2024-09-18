import React from "react";
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

    @action handleAdd = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        this.fields.push({id: this.fieldId++});
    };

    @action handleDelete = (e: React.MouseEvent<HTMLElement>, id: number) => {
        e.preventDefault();
        let contentArray = this.props.formStore.data[this.props.name] || [];
        contentArray.splice(id, 1);
        this.props.formStore.setInputFieldValue(this.props.name, contentArray);
        this.fields = this.fields.filter(field => field.id !== id);
    };

    @action handleChange = (ind: number, value: string) => {
        const contentArray = this.props.formStore.data[this.props.name] || [];
        contentArray[ind] = value;
        this.props.formStore.setInputFieldValue(this.props.name, contentArray);
    }

    render() {
        return (
            <>
                {this.fields.map((field, index) => (
                    <div key={field.id} style={{display: "flex", gap: "10px"}}>
                        <input
                            type="text"
                            name={`${index}`}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(+e.target.name, e.target.value)}
                        />
                        <button
                            className="tertiary-button"
                            onClick={(e: React.MouseEvent<HTMLElement>) => this.handleDelete(e, field.id)}
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
