import React, {Component} from "react";
import {base_url} from "../../constants";
import * as authActions from "../../store/actions/authActions";
import {connect} from "react-redux";


class ProductTable extends Component{

    state = {
        productList: [],
    }

    componentDidMount(){
        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
                .then(result => {
                    if(result){
                        this.getProducts();
                    }else{
                        this.props.history.push('/login');
                    }
                })
        }else{
            this.getProducts();
        }
    }

    //------------------Get all available products--------------------
    getProducts = () => {
        console.log(this.props.auth.isAuthenticated)
        //const token =  this.props.auth.token;
        fetch(`${base_url}/products`, {
            headers: {
                'Content-Type': 'application/json',
                //'auth-token': token
            }
        })
            .then(response => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
                this.setState({
                    productList: jsonResponse.message
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    formatDate = (date) => {
        let d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    //-----------------------Add discount to selected product--------------------
    addDiscounts = (ProductId) => {

        /*const discount = {
            proID:ProductId,
            offer:this.state.offer
        }*/

        const proID = ProductId;
        const offer = this.state.offer;
        console.log(proID+'--'+offer)
        fetch(`${base_url}/products/update/offer`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': this.props.auth.token
            },

            method: 'PUT',
            body: {
                _id:proID,
                offer:offer
            }
        })
            .then(response => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
            })
            .catch(error => {
                console.log(error);
            })

    }

    //---------------------Delete a selected product-------------------
    //===============Refresh the browser after delete==================
    removeProduct = (id) =>{
        fetch(`${base_url}/products/delete/`+id, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': this.props.auth.token
            },
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
                this.getProducts();
            })
            .catch(error => {
                console.log(error);
            })
    }


    render() {

        /*if(this.state.removeProduct.isSuccess){
            let msg = <success>{this.state.removeProduct.errorMessage}</success>;
        }*/

        return (
            <div class="container">
                <h4>Available Products</h4>
                <table className="table table-striped">
                    <thead class="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Discount</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Option</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    {
                        this.state.productList.map(product => {
                            return(
                                <tbody>
                                <tr>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.offer}</td>
                                    <td>{this.formatDate(product.createdAt)}</td>
                                    <td>{product.stock}</td>
                                    <td><input type="text" placeholder="Discount" value={this.state.offer} />&nbsp;&nbsp;<button type="submit" value="Submit" className="btn btn-dark" onClick={()=>{this.addDiscounts(product._id)}}>Add Discount</button></td>
                                    <td><button type="submit" value="Submit" className="btn btn-dark" onClick={()=>{this.removeProduct(product._id)}}>Delete</button></td>
                                </tr>
                                </tbody>
                            )
                        })
                    }
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getToken: () => dispatch(authActions.getToken())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductTable);