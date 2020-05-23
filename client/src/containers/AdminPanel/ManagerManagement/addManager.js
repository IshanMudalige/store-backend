import React, { Component } from 'react';
import * as authActions from '../../../store/actions/authActions';
import { connect } from 'react-redux';
import { base_url } from '../../../constants';
import Header from "../../../components/Header/Header";
import ManagerTable from "./managerTable";
import Error from "../../../components/Message/Error/error";
import Success from "../../../components/Message/Success/succeess";

import '../title.styles.css';

class AddManager extends Component{

    state = {
        manager: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
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
                        // let category = {...this.state.category}
                        // category.createdBy = this.props.auth.user.userId;
                        // this.setState({category});
                    }

                })
                .catch(er => {
                    console.log(er);
                });
        }
    }


    setError = (error, message,success) => {
        const { manager } = this.state;
        const updatedManagerForm = {
            ...manager,
            isError: error,
            errorMessage: message,
            isSuccess: success
        }
        this.setState({
            manager: updatedManagerForm
        });
    }

    managerSubmitHandler = (e) => {
        e.preventDefault();

        const { manager } = this.state;
        if(manager.firstName === ''){
            this.setError(true, 'Enter First Name',false); return;
        }
        if(manager.lastName === ''){
            this.setError(true, 'Enter Last Name',false); return;
        }
        if(manager.email === ''){
            this.setError(true, 'Enter Email',false); return;
        }
        if(manager.password === ''){
            this.setError(true, 'Enter Password',false); return;
        }

        this.setError(false, 'Manager added successfully',true);

        fetch(`${base_url}/manager/signup`, {
            headers: {
                'Content-Type': 'application/json',
                //'auth-token': this.props.auth.token
            },
            method: 'POST',
            body: JSON.stringify(this.state.manager)
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
        const manager = this.state.manager;
        const updatedManager = {
            ...manager,
            [e.target.name] :  e.target.value,
            isError: false,
            errorMessage: '',
            isSuccess: false
        };
        this.setState({
            manager: updatedManager
        })
    }

    render() {

        const managerForm = this.state;
        let msg =  <Error>{this.state.manager.errorMessage}</Error>;
        if(this.state.manager.isSuccess){
            msg = <Success>{this.state.manager.errorMessage}</Success>;
        }

        return (
            <React.Fragment>
                <Header />
                <br/>
                <div className="container">
                    <p className="txt">Manager Management</p>
                    <h4>Add New Store Manager</h4>
                    <form onSubmit={this.managerSubmitHandler}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input type="text" className="form-control" name="firstName" value={managerForm.firstName} onChange={this.inputHandler} placeholder="First Name"/>
                            </div>
                            <div className="form-group col-md-6">
                                <input type="text" className="form-control" name="lastName" value={managerForm.lastName} onChange={this.inputHandler} placeholder="Last Name"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input type="email" className="form-control" name="email" value={managerForm.email} onChange={this.inputHandler} placeholder="Email"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input type="password" className="form-control" name="password" value={managerForm.password} onChange={this.inputHandler} placeholder="Password"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                {msg}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-dark">Add Manager</button>
                    </form>
                </div>
                <br/>
                <ManagerTable/>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddManager);