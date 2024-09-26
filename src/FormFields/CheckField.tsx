import React from 'react';
import withHOCField from "../Components/FieldComponent";
import { action, makeObservable } from "mobx";
import { observer } from "mobx-react";
import { FormStore } from "../Stores/FormStore";

interface ICheckFieldProps {
    name: string;
    options: string[];
    formStore: FormStore;
}

@observer
class WrappedCheckField extends React.Component<ICheckFieldProps> {
    optionsList: string[] = [];

    constructor(props: ICheckFieldProps) {
        super(props);
        makeObservable(this);
    }

    @action handleCheckedFields = (value: string) => {
        let contentArray = this.props.formStore.data[this.props.name] || [];
        if (!contentArray.includes(value)) {
            contentArray.push(value);
        } else {
            contentArray = contentArray.filter((val: any) => val !== value);
        }
        this.props.formStore.setInputFieldValue(this.props.name, contentArray);
    }

    @action allOptionsList = (tags: string[]) => {
        const uniqueTags = tags.filter((tag: string) => !this.props.options.includes(tag));
        this.optionsList = [...this.props.options, ...uniqueTags];
    }

    componentDidMount() {
        this.allOptionsList(this.props.formStore.data[this.props.name] || []);
    }

    render() {
        const { name, formStore } = this.props;
        return (
            <div className="responsive-checkfield">
                {this.optionsList.map((option: string, index: number) => (
                    <div key={index} className="checkbox-container">
                        <input
                            type="checkbox"
                            name={option}
                            value={option}
                            checked={formStore.data[name].includes(option.toLowerCase())}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleCheckedFields(e.target.value)}
                        />
                        <span style={{ marginLeft: "0.2rem" }}>{option}</span>
                    </div>
                ))}
            </div>
        );
    }
}

export const CheckField = withHOCField(WrappedCheckField);
