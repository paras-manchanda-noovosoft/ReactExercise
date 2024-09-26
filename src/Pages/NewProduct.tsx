import React from 'react';
import {observer} from 'mobx-react';
import {RootContext} from "../context/RouterContext";
import {FormStore} from "../Stores/FormStore";
import {ProductStore} from "../Stores/ProductStore";
import {CategoryStore} from "../Stores/CategoryStore";
import FormComponent from "../Components/FormComponent";
import {action} from "mobx";
import {StringField} from "../FormFields/StringField";
import {NumberField} from "../FormFields/NumberField";
import {TextAreaField} from "../FormFields/TextArea";
import {SelectField} from "../FormFields/SelectField";
import {RadioField} from "../FormFields/RadioField";
import {CheckField} from "../FormFields/CheckField";
import {DynamicField} from '../FormFields/JsonInput';

interface INewProductProps {
    productStore?: ProductStore;
    categoryStore?: CategoryStore;
}

interface INewProductState {
    product: any;
}

class Product {
    product_name: string = "";
    product_tags: string[] = [];
    description: string = "";
    category: string = "";
    price: number = 0;
    discount: number = 0;
    thumbnail: string = "https://picsum.photos/id/0/5000/3333";
    rating: number = 0;
    id: number = 0;
    isDeleted: boolean = false;
    productType: string = "";
    productReviews: string[] = [];
}


@observer
export class NewProduct extends React.Component <INewProductProps, INewProductState> {

    static contextType = RootContext;
    context!: React.ContextType<typeof RootContext>
    formStore: FormStore = new FormStore(new Product());
    routerStore: any;

    get isEditMode() {
        return Number.isInteger(+this.context.routerStore.routerState.params.productId);
    }

    componentDidMount() {
        this.routerStore = this.context.routerStore;
        const id = this.context.routerStore.routerState.params.productId;
        if (id) {
            this.setProductData(id);
        }

        this.setValidateFields();
        this.props.categoryStore?.setCategoryDetails();
    }


    setProductData(id: string) {

        const {productStore} = this.props;
        const product = productStore && productStore.getProductById(id);
        if (product) {
            this.formStore.setData(product);
        } else {
            alert('Product Id does not Exist !! So redirected to New Product');
            this.routerStore.goTo('NewProductPage').then();
        }
    }

    @action setValidateFields() {
        this.formStore.validateFields = {
            ...this.formStore.validateFields,
            "description": {required: true}
        }
    }

    @action handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (this.formStore.validate()) {
            if (this.props.productStore) {
                try {
                    if (this.isEditMode) {
                        this.props.productStore.updateProduct(this.formStore.formData);
                    } else {
                        let localId = JSON.parse(localStorage.getItem('id') || '195');
                        this.formStore.setInputFieldValue("id", +localId);
                        localStorage.setItem('id', JSON.stringify(+localId + 1));
                        this.props.productStore.setAddProduct(this.formStore.formData);
                    }
                } catch (error) {
                    console.error('Error accessing localStorage:', error);
                }
            }
            await this.context.routerStore.goTo('HomePage');
        }
    };

    render() {
        return (
            <>
                <div>
                    <button className="go-back-from-cart margin-screen"
                            onClick={() => this.routerStore.goTo('HomePage')}>Go back
                    </button>
                    <div className="add-cart-page">
                        <h2>{this.isEditMode ? 'Edit Product' : 'Add a New Product'}</h2>
                        <div className="add-form">

                            <FormComponent formStore={this.formStore} onSubmit={this.handleSubmit}
                                           showResetButton={true}>

                                <StringField
                                    name="product_name"
                                    label="Name"
                                    required={true}
                                />

                                <SelectField
                                    name="category"
                                    label="category"
                                    options={this.props.categoryStore?.categoryList || []}
                                    required={true}
                                    default="select a category"
                                />
                                <NumberField
                                    name="price"
                                    label="price"
                                    required={true}
                                />

                                <NumberField
                                    name="discount"
                                    label="discount"
                                    required={true}
                                />
                                <RadioField
                                    name="productType"
                                    label="Product Type"
                                    options={["Type 1", "Type 2", "Type 3"]}
                                    required={true}
                                    formStore={this.formStore}
                                />

                                <CheckField
                                    component={<input type="text"/>}
                                    formStore={this.formStore}
                                    name="product_tags"
                                    label="Product Tags"
                                    options={["beauty", "lipstick", "nail polish", "fragrances", "perfumes", "furniture", "beds"]}
                                    required={true}
                                />

                                <DynamicField
                                    formStore={this.formStore}
                                    name="productReviews"
                                    label="Product Reviews"
                                    inputLabel="Review"
                                    required={true}
                                    inputComponent={<StringField/>}
                                />

                                <TextAreaField
                                    label="description"
                                    name="description"
                                    required={true}
                                />

                            </FormComponent>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}
