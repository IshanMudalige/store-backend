import React, {Component} from 'react';
import * as productActions from '../../store/actions/productActions';
import  { connect } from 'react-redux';
import Error from "../../components/Message/Error/error";
import * as authActions from "../../store/actions/authActions";
import {base_url} from "../../constants";
import Header from "../../components/Header/Header";
import ProductTable from "./productTable";
import Success from "../../components/Message/Success/succeess";


class AddProducts extends Component {

    state = {
        product: {
            name:'',
            price:'',
            stock:'',
            description:'',
            keyword:'',
            category:'',
            productPic:[],
            createdBy:'',
            isError: false,
            errorMessage: '',
            isSuccess:false
        },
        image:{
            img:''
        },
        categoryList: []
    }

    componentDidMount() {
        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
                .then(result => {
                    if(result){
                        this.getCategories();
                        let product = {...this.state.product}
                        product.createdBy = this.props.auth.user.userId;
                        this.setState({product});
                    }

                })
                .catch(er => {
                    console.log(er);
                });
        }
    }

    //---------------Get all available categories in the store------------------
    //================Refresh the browser to get categories=====================
    getCategories = () => {
        console.log(this.props.auth.isAuthenticated)
        //const token =  this.props.auth.token;
        fetch(`${base_url}/category`, {
            headers: {
                'Content-Type': 'application/json',
                //'auth-token': token
            }
        })
            .then(response => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
                this.setState({
                    categoryList: jsonResponse.message
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    textHandler = (e) => {
        const product = this.state.product;
        const updatedProduct = {
            ...product,
            [e.target.name] : e.target.value,
            isError: false,
            errorMessage: '',
            isSuccess: false
        }
        this.setState({
            product: updatedProduct
        })

    }

    selectBoxHandler = (e) =>{
        let product = {...this.state.product}
        product.category = e.target.value;
        this.setState({product});
    }

    imageHandler = (e) =>{
        const image = this.state.image;
        const updatedImage = {
            ...image,
            [e.target.name] : e.target.value
        }
        this.setState({
            image: updatedImage
        })
    }

    setError = (error, message,success) => {
        const { product } = this.state;
        const updatedProduct = {
            ...product,
            isError: error,
            errorMessage: message,
            isSuccess: success
        }
        this.setState({
            product: updatedProduct
        });
    }

    addProductsHandler = (e) => {
        e.preventDefault();
        const { product } = this.state;
        const { image } = this.state;

        if(product.name === ''){
            this.setError(true, 'Enter Product Name',false); return;
        }

        if(product.category === ''){
            this.setError(true,'Select a Category',false); return;
        }

        if(image.img === ''){
            this.setError(true,'Enter Image URL',false); return;
        }

        if(product.description === ''){
            this.setError(true,'Enter Description',false); return;
        }

        if(product.price === ''){
            this.setError(true,'Enter Price',false); return;
        }

        if(product.keyword === ''){
            this.setError(true,'Enter Keyword',false); return;
        }

        if(product.stock === ''){
            this.setError(true,'Enter Stock',false); return;
        }

        product.productPic.push(this.state.image);
        this.setError(false,'Product added successfully',true);
        fetch(`${base_url}/products/create`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': this.props.auth.token
            },
            method: 'POST',
            body: JSON.stringify(this.state.product)
        })
            .then(response => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
            })
            .catch(error => {
                console.log(error);
            })

    }



    render() {

        const {product,image}  = this.state;
        let msg =  <Error>{this.state.product.errorMessage}</Error>;
        if(this.state.product.isSuccess){
            msg = <Success>{this.state.product.errorMessage}</Success>;
        }

        return (
            <React.Fragment>
                <Header/>
                <br/>
                <div className="container">
                    <p className="txt">Products Management</p>
                    <h4>Add New Product</h4>
                    <form onSubmit={this.addProductsHandler} >
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputAddress">Product Name</label>
                                <input type="text" className="form-control"  name="name" placeholder="Product Name" value={product.name} onChange={this.textHandler} />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputState">Select Category</label>

                                <select id="inputState" className="form-control" value={product.category} onChange={this.selectBoxHandler} >
                                    {
                                        this.state.categoryList.map(categories =>{
                                            return(
                                                categories.children.map(sub =>{
                                                    return (
                                                        <option value={sub._id} key={sub._id}>{sub.name}</option>
                                                    )
                                                })
                                            )

                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label htmlFor="inputAddress">Description</label>
                                <textarea type="text" className="form-control"  name="description" placeholder="Description" value={product.description} onChange={this.textHandler} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputAddress">Price</label>
                                <input type="number" className="form-control"  name="price" placeholder="Price" value={product.price} onChange={this.textHandler} />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputAddress">Image</label>
                                <input type="text" className="form-control"  name="img" placeholder="Image URL" value={image.img} onChange={this.imageHandler} />
                            </div>
                        </div >
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputAddress">Stock</label>
                                <input type="number" className="form-control"  name="stock" placeholder="Stock" value={product.stock} onChange={this.textHandler} />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputAddress">Keyword</label>
                                <input type="text" className="form-control"  name="keyword" placeholder="Keyword" value={product.keyword} onChange={this.textHandler} />
                            </div>
                        </div>
                        {msg}
                        <div className="form-group ">
                            <button type="submit" value="Submit" className="btn btn-dark">ADD</button>
                        </div>
                    </form>
                </div>
                <br/>
                <ProductTable/>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addProducts: (product) => dispatch(productActions.addProducts(product)),
        getToken: () => dispatch(authActions.getToken())
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AddProducts);