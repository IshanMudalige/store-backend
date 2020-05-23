import React, { Component } from 'react';
import * as authActions from '../../store/actions/authActions';
import { Link, Redirect } from 'react-router-dom';
import  { connect } from 'react-redux';
import Error from '../../components/Message/Error/error';
import Header from "../../components/Header/Header";

class Signup extends Component {

    state = {
        redirectToreferrer: false,
        signupForm: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            repassword: '',
            isError: false,
            errorMessage: ''
        }
    }

    textHandler = (e) => {
        const signupForm = this.state.signupForm;
        const updateSignupForm = {
            ...signupForm,
            [e.target.name] : e.target.value
        }
        console.log('called--');
        this.setState({
            signupForm: updateSignupForm
        })

    }

    setError = (error, message) => {
        const { signupForm } = this.state;
        const updatedSignupForm = {
            ...signupForm,
            isError: error,
            errorMessage: message
        }
        this.setState({
            signupForm: updatedSignupForm
        });
    }

    signupHandler = (e) => {
        e.preventDefault();
        const { signupForm } = this.state;
        if(signupForm.firstName === ''){
            this.setError(true, 'Enter First Name'); return;
        }
        if(signupForm.lastName === ''){
            this.setError(true, 'Enter Last Name');
            return;
        }

        const emailPattern = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
        if(!emailPattern.test(signupForm.email)){
            this.setError(true, 'Invalid Email Address'); return;
        }

        if(signupForm.email === ''){
            this.setError(true, 'Enter Email');
            return;
        }
        if(signupForm.password === ''){
            this.setError(true, 'Enter Password');
            return;
        }
        if(signupForm.repassword === ''){
            this.setError(true, 'Enter Repassword');
            return;
        }
        if(signupForm.password !== signupForm.repassword){
            this.setError(true, 'Password dosent match');
            return;
        }

        const user = {
            firstName: signupForm.firstName,
            lastName: signupForm.lastName,
            email: signupForm.email,
            password: signupForm.password
        }

        this.props.signup(user)
            .then(jsonResponse => {
                console.log(jsonResponse);
                this.props.history.push({
                    pathname: '/login',
                    search: '?signup=success',
                    state: jsonResponse.message
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    componentDidMount() {
        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
                .then(result => {
                    // result will be either true or false
                    if(result){
                        this.setState({
                            redirectToreferrer: true
                        });
                    }

                })
                .catch(er => {
                    console.log(er);
                });
        }
    }

    render() {

        const { signupForm, redirectToreferrer }  = this.state;

        if(redirectToreferrer){
            return <Redirect to="/" />
        }

        return (
            <React.Fragment>
                <Header/>
            <div className="jumbotron bg-transparent d-flex align-items-center">
                <form className="col-md-4 offset-md-4" onSubmit={this.signupHandler} >
                    <div>
                        <h4>Sign Up</h4>
                    </div>
                    <br/>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputEmail4">First Name</label>
                            <input type="text" className="form-control" name="firstName" placeholder="First Name"  value={signupForm.firstName} onChange={this.textHandler} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputPassword4">Last Name</label>
                            <input type="text" className="form-control"  name="lastName" placeholder="Last Name" value={signupForm.lastName} onChange={this.textHandler}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddress">Email</label>
                        <input type="email" className="form-control"  name="email" placeholder="Email" value={signupForm.email} onChange={this.textHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddress2">Password</label>
                        <input type="password" className="form-control" name="password" placeholder="Password" value={signupForm.password} onChange={this.textHandler}/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="inputCity">Re-enter Password</label>
                        <input type="password" className="form-control" name={"repassword"} placeholder="Password" value={signupForm.repassword} onChange={this.textHandler}/>
                    </div>
                    <br/>
                    <Error>{this.state.signupForm.errorMessage}</Error>
                    <div className="form-group ">
                        <button type="submit" value="Submit" className="btn btn-dark btn-block">Register</button>
                    </div>
                    <div>
                        <span>Already have an account ? </span><Link to="/login"> Login here</Link>
                    </div>
                </form>
            </div>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signup: (user) => dispatch(authActions.signup(user)),
        getToken: () => dispatch(authActions.getToken())
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);