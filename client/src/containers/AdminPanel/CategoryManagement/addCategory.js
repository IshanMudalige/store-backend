import React, { Component } from 'react';
import * as authActions from '../../../store/actions/authActions';
import { connect } from 'react-redux';
import { base_url } from '../../../constants';
import Header from "../../../components/Header/Header";
import CategoryTable from "./categoryTable";
import Error from "../../../components/Message/Error/error";
import Success from "../../../components/Message/Success/succeess";

import '../title.styles.css';

class AddCategory extends Component{

    state = {
        category: {
            name: '',
            slug: '',
            parent: '',
            createdBy:'',
            isError: false,
            errorMessage: '',
            isSuccess:false
        }
    }

    componentDidMount() {
        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
                .then(result => {
                    if(result){
                       let category = {...this.state.category}
                       category.createdBy = this.props.auth.user.userId;
                       this.setState({category});
                    }

                })
                .catch(er => {
                    console.log(er);
                });
        }
    }

    setError = (error, message,success) => {
        const { category } = this.state;
        const updatedCategoryForm = {
            ...category,
            isError: error,
            errorMessage: message,
            isSuccess: success
        }
        this.setState({
            category: updatedCategoryForm
        });
    }

    categorySubmitHandler = (e) => {
        e.preventDefault();

        const { category } = this.state;
        if(category.name === ''){
            this.setError(true, 'Enter Name',false); return;
        }
        if(category.slug === ''){
            this.setError(true, 'Enter Keyword',false); return;
        }

        this.setError(false, 'Category added successfully',true);

        fetch(`${base_url}/category`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': this.props.auth.token
            },
            method: 'POST',
            body: JSON.stringify(this.state.category)
        })
            .then(response => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
            })
            .catch(error => {
                console.log(error);
            })
        this.forceUpdate();
    }

    inputHandler = (e) => {
        const category = this.state.category;
        const updatedCategory = {
            ...category,
            [e.target.name] :  e.target.value,
            isError: false,
            errorMessage: '',
            isSuccess: false
        };
        this.setState({
            category: updatedCategory
        })
    }


    render() {

        const categoryForm = this.state;
        let msg =  <Error>{this.state.category.errorMessage}</Error>;
        if(this.state.category.isSuccess){
            msg = <Success>{this.state.category.errorMessage}</Success>;
        }

        return (
            <React.Fragment>
                <Header />
                <br/>
                <div class="container">
                    <p className="txt">Category Management</p>
                    <h4>Add New Category</h4>
                    <form onSubmit={this.categorySubmitHandler}>
                        <div className="row">
                            <div className="col">
                                <input type="text" className="form-control" name="name" value={categoryForm.name} onChange={this.inputHandler} placeholder="Name"/>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="slug" value={categoryForm.slug} onChange={this.inputHandler} placeholder="Keyword"/>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" name="parent" value={categoryForm.parent} onChange={this.inputHandler} placeholder="ParentID(Optional)"/>
                            </div>
                            <div className="col">
                                <button type="submit" value="submit" className="btn btn-dark btn-block">Add</button>
                            </div>
                        </div>
                        <br/>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                {msg}
                            </div>
                        </div>
                    </form>
                </div>

                <br/>
                <CategoryTable/>

            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddCategory);