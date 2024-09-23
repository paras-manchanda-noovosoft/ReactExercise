import React from 'react';
import withHOCField from "../Components/FieldComponent";
import {action, makeObservable} from "mobx";
import {observer} from "mobx-react";

@observer
class WrappedCheckField extends React.Component<any> {

    constructor(props: any) {
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


    render() {
        const {name, options, formStore} = this.props;
        return (
            <>
                <div className="responsive-checkfield">
                    {options.map((option: string, index: number) => (
                        <div key={index} className="checkbox-container">
                            <input
                                type="checkbox"
                                name={option}
                                value={option}
                                checked={formStore.data[name].includes(option.toLowerCase())}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleCheckedFields(e.target.value)}
                            />
                            <span style={{marginLeft:"0.2rem"}}>{option}</span>
                        </div>
                    ))}
                </div>

            </>
        )
    }
}

export const CheckField = withHOCField(WrappedCheckField);