import React from "react";

class CommonProduct extends React.Component<any> {
    render() {
        const product = this.props.product;
        return (
            <>
                <img src={product.thumbnail ?? ""} alt={product.product_name} className="product-thumbnail"/>
                <div className="product-details full-width">
                    <h4>
                        {product.product_name} (
                        {product.product_tags.length > 0 && product.product_tags.map((tag: string, index: number) => (
                            <span className="light-small-text" style={{paddingLeft: '0.6rem'}} key={index}>{tag}</span>
                        ))}
                        )
                    </h4>
                    <p>Price: ${product.discount} <span className="text-styling-gray">(${product.price})</span></p>
                    <p>Category: {product.category}</p>
                    <p>{product.description}</p>
                    <p>Rating: {product.rating}</p>
                </div>
            </>
        )
    }
}

export default CommonProduct;