import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import { connect } from 'react-redux';
import * as cartActions from '../../store/actions/cartActions';
import * as authActions from '../../store/actions/authActions';
import './productdetails.styles.css';
import { base_url } from '../../constants';
import StarRatingComponent from 'react-star-rating-component';

class ProductDetails extends Component{

    state = {
        product: null,
        redirectToReferrer: false,
        review:'',
        rating:0
    }

    componentDidMount() {

        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
                .then(result => {
                    if(result){
                        this.props.getCartItems(this.props.auth.token, this.props.auth.user.userId)
                            .then(response => {
                                console.log(response);
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }

        const { category, slug } = this.props.match.params;
        fetch(`${base_url}/products/${category}/${slug}`)
            .then(response => response.json())
            .then(jsonResponse => {

                if(jsonResponse.hasOwnProperty('message')){
                    console.log(jsonResponse);
                    this.setState({
                        product: jsonResponse.message
                    })
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

    addToCart = (productId, price, name, image) => {

        if(!this.props.auth.isAuthenticated){
            this.props.history.push('/login');
            return;
        }

        const { auth } = this.props;
        const cartItem = {
            user: auth.user.userId,
            product: productId,
            name: name,
            image: image,
            quantity: 1,
            price: price
        }

        this.props.addToCart(auth.token, cartItem)
            .then(response => {
                console.log(this.props.cart);
            })
            .catch(error => {
                console.log(error);
            });
    }

    addReview = (productId) =>{

        if(!this.props.auth.isAuthenticated){
            this.props.history.push('/login');
            return;
        }

        const reviews ={
            review: this.state.review,
            rating:this.state.rating,
            name:this.props.auth.user.firstName+' '+this.props.auth.user.lastName,
            userId:this.props.auth.user.userId,
            productId:productId
        }

        fetch(`${base_url}/products/addReview`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': this.props.auth.token
            },
            method: 'PUT',
            body: JSON.stringify(reviews)
        })
            .then(response => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
            })
            .catch(error => {
                console.log(error);
            })
    }

    textHandler = (e) =>{
        this.setState({
            review:e.target.value
        });
    }

    formatDate = (date) => {
        let d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }

    render(){

        const { product } = this.state;

        let productDescription;

        if(this.state.product){
            productDescription =
                <div className="Content">
                    <div className="ProductDetailsWrapper">
                        <div className="ProductDetailsImage">
                            <div className="ProductDetailsImageWrapper">
                                <img src={product.productPic[0].img} alt="" />
                            </div>
                        </div>
                        <div className="ProductDetails">
                            <div className="row">
                            <h2 >{product.name}</h2>
                            </div>
                            <div className="row">
                                <h1><i className="fa fa-usd" aria-hidden="true"/> {product.price}</h1>
                                &nbsp; &nbsp;
                                <h2 className="text-success">{product.offer}% off</h2>
                            </div>
                            <div className="row">
                                <StarRatingComponent
                                    name="rating"
                                    starCount={5}
                                    editing={false}
                                    value={product.rating}
                                    renderStarIcon={()=> <i className="fa fa-star fa-lg" aria-hidden="true"/>}/>
                                &nbsp; &nbsp;
                            </div>
                            <div className="row">
                                <p><i className="text-success fa fa-check-square-o" aria-hidden="true"/> <strong>Bank
                                    Offer</strong> 20% Instant Discount on Visa Credit Cards</p>
                                <p><i className="text-success fa fa-check-square-o" aria-hidden="true"/> <strong>Bank
                                    Offer</strong> 5% Unlimited Cashback on BOC Credit Cards </p>
                            </div>
                            <div className="row">
                                <h3 className="text-info"><i className="fa fa-map-marker" aria-hidden="true"/></h3>
                                <p> &nbsp; Delivery | &nbsp;<span>FREE</span></p>
                            </div>
                            <div className="row">
                                <div className="ProductDescription">
                                    <h5>Product Description</h5>
                                    <p>{product.description}</p>
                                </div>
                            </div>
                            <div className="row ActionButtonWrapper">
                                <button onClick={() => { this.addToCart(product._id, product.price, product.name, product.productPic[0].img) }}><i className="fa fa-shopping-cart"></i>&nbsp;ADD TO CART</button>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-5 mb-5">
                        <div className="row">
                            <h3>Ratings & Reviews</h3>
                        </div>
                        {product.reviews.map(r =>{
                            return(
                                <div className="row mt-5 mb-5">
                                    <div className="media">
                                        <div className="mr-3">
                                            <i className="fa fa-user-o fa-3x" />
                                        </div>
                                        <div className="media-body">
                                            <h5 className="mt-0">{r.name} - {this.formatDate(r.createdAt)}</h5>
                                            <StarRatingComponent
                                                name="rating"
                                                starCount={5}
                                                editing={false}
                                                value={r.rating}
                                                renderStarIcon={()=> <i className="fa fa-star fa-lg" aria-hidden="true"/>}/>
                                            <p>{r.review}</p>

                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                        <div className="row mb-5">
                            <h3> Post Your Own Reviews</h3>
                        </div>
                        <form>
                            <label htmlFor="exampleInputPassword1">Rate</label>
                            <div className="form-group">
                                <StarRatingComponent
                                    name="rating"
                                    starCount={5}
                                    value={this.state.rating}
                                    onStarClick={this.onStarClick.bind(this)}
                                    renderStarIcon={()=> <i className="fa fa-star fa-lg" aria-hidden="true"/>}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Review</label>
                                <textarea type="text" className="form-control" id="exampleInputtextarea"
                                          placeholder="write your own reviews" rows="3" value={this.state.review} onChange={this.textHandler}/>
                            </div>
                            <button onClick={()=>{this.addReview(product._id)}} type="submit" className="btn btn-dark">Submit</button>
                        </form>
                    </div>
                </div>

        }else{
            productDescription = <div>Product is loading...!</div>
        }

        return (
            <div>
                <Header/>
                <br/>
                {productDescription}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        cart: state.cart
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addToCart: (token, cartItem) => dispatch(cartActions.addToCart(token, cartItem)),
        getCartItems: (token, userId) => dispatch(cartActions.getCartItems(token, userId)),
        getToken: () => dispatch(authActions.getToken())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);