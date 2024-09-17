import React from 'react';
import {observer} from 'mobx-react';
import CategoryDropDown from '../Components/CategoryDropDown';
import {RootContext} from "../context/RouterContext";
import {FormStore} from "../Stores/FormStore";
import {ProductStore} from "../Stores/ProductStore";
import {CategoryStore} from "../Stores/CategoryStore";
import FieldComponent from "../Components/FieldComponent";
import FormComponent from "../Components/FormComponent";
import {action} from "mobx";

interface NewProductProps {
    productStore?: ProductStore;
    categoryStore?: CategoryStore;
}

interface NewProductState {
    product: any;
}

class Product {
    product_name: string = "";
    product_tags: string[] = [];
    description: string = "";
    category: string = "";
    price: number = 0;
    discount: number = 0;
    thumbnail: string = "";
    rating: number = 0;
    id: number = 0;
    isDeleted: boolean = false;
}


@observer
export class NewProduct extends React.Component <NewProductProps, NewProductState> {

    constructor(props: NewProductProps) {
        super(props);
    }

    static contextType = RootContext;
    context!: React.ContextType<typeof RootContext>
    isEditMode: boolean = false;
    formStore: FormStore = new FormStore(new Product());

    componentDidMount() {
        const {productStore} = this.props;
        const routerStore = this.context.routerStore;
        const {routerState} = routerStore;
        const id = routerState.params.productId;
        if (id) {
            this.isEditMode = true;
            const product = productStore && productStore.getProductById(id);
            if (product) {
                this.formStore.setData(product);
            } else {
                this.isEditMode = false;
                alert('Product Id does not Exist !! So redirected to New Product ');
            }
        }
        this.setValidateFields();
    }

    @action setValidateFields() {
        this.formStore.validateFields = {
            ...this.formStore.validateFields,
            "description": true
        }
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    handleCategoryChange = (category: string): void => {
        this.formStore.setInputFieldValue("category", category);
    };

    render() {
        return (
            <>
                <div className="add-cart-page">
                    <h2>{this.isEditMode ? 'Edit Product' : 'Add a New Product'}</h2>
                    <div className="add-form">
                        <FormComponent formStore={this.formStore} onSubmit={this.handleSubmit}
                                       showResetButton={true}>
                            <FieldComponent
                                formStore={this.formStore}
                                name="product_name"
                                label="Name"
                                type="text"
                                required={true}
                            />
                            <div>
                                <label htmlFor="category">Category:</label>
                                <CategoryDropDown
                                    categoryData={this.props.categoryStore?.categoryList || []}
                                    onSelect={this.handleCategoryChange}
                                    value={this.formStore.data["category"]}
                                />
                                {this.formStore.errors.category && (
                                    <p className="red-color">{this.formStore.errors.category}</p>
                                )}
                            </div>
                            <FieldComponent
                                formStore={this.formStore}
                                name="price"
                                label="price"
                                type="number"
                                required={true}
                            />

                            <FieldComponent
                                formStore={this.formStore}
                                name="discount"
                                label="discount"
                                type="number"
                                required={true}
                            />

                            <div>
                                <label htmlFor="description">Description: </label>
                                <textarea
                                    style={{
                                        textAlign: 'left',
                                        verticalAlign: 'top',
                                        wordWrap: 'break-word',
                                        width: "93%",
                                        height: "200px",
                                        padding: "20px",
                                        fontSize: "20px"
                                    }}
                                    name="description"
                                    value={this.formStore.data["description"]}
                                    onChange={(e) => this.formStore.setInputFieldValue(e.target.name, e.target.value)}
                                />
                                {this.formStore.errors.description && (
                                    <p className="red-color">{this.formStore.errors.description}</p>
                                )}
                            </div>
                        </FormComponent>
                    </div>
                </div>
            </>
        )
    }
}
