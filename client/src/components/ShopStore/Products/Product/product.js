import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import '../style.css';
import StarRatingComponent from "react-star-rating-component";

const Product = props => {

    const url = props.match.url === '/' ? '/products/all' : props.match.url;

    return (
        <Link className="text-link" to={`${url}/${props.slug}`}>
            <div className="Product">
                <div className="ProductImage">
                    <img alt="" src={props.productPic[0].img} />
                </div>
                <div>
                    <div className="product-name">&nbsp;&nbsp; {props.name}</div>
                    <div className="star-rating">
                        <StarRatingComponent
                            name="rating"
                            starCount={5}
                            editing={false}
                            value={props.rating}
                            renderStarIcon={()=> <i className="fa fa-star fa-xs" aria-hidden="true"/>}/>
                    </div>
                    <div className="product-price">&nbsp;&nbsp; $ {props.price}</div>

                </div>
            </div>
        </Link>
    );
}

export default withRouter(Product);