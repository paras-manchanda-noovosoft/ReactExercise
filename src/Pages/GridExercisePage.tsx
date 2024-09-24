import React from "react";
import {IProduct} from "../Types/ProductTypes";

class GridExercisePage extends React.Component<any> {

    componentDidMount() {
        this.props.productStore.setProductDetails("", 0).then();
    }

    render() {
        const products = this.props.productStore.productDetails;
        return (
            <>
                <div className="three-column-grid">
                    {products.length > 0 ? (
                        products.map((product: IProduct) => (
                            <div key={product.id} className="product-item column-direction">
                                <img
                                    src={product.thumbnail ?? ""}
                                    alt={product.product_name}
                                    className="product-thumbnail"
                                />
                                <div className="product-details full-width">
                                    <h4>
                                        {product.product_name} (
                                        {product.product_tags.length > 0 && product.product_tags.map((tag: string, index: number) => (
                                            <span
                                                className="light-small-text"
                                                style={{paddingLeft: '0.6rem'}}
                                                key={index}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        )
                                    </h4>
                                    <p>
                                        Price: ${product.discount}{" "}
                                        <span className="text-styling-gray">(${product.price})</span>
                                    </p>
                                    <p>Category: {product.category}</p>
                                    <p>{product.description}</p>
                                    <p>Rating: {product.rating}</p>
                                    <button
                                        className="primary-button"
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                                <div className="edit-product-order top-right-action-buttons">
                                    <button
                                        className="secondary-button"
                                        style={{margin: "0 0.7rem"}}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="tertiary-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>
            </>
        );
    }
}

export default GridExercisePage;