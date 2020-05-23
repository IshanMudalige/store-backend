import React, {Component} from "react";
import {base_url} from "../../../constants";
import * as authActions from "../../../store/actions/authActions";
import {connect} from "react-redux";

class ManagerTable extends Component{

    state = {
        managerList: []
    }

    componentDidMount(){
        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
                .then(result => {
                    if(result){
                        this.getManagers();
                    }else{
                        this.props.history.push('/login');
                    }
                })
        }else{
            this.getManagers();
        }
    }

    componentDidUpdate(){
        this.getManagers()
    }

    getManagers = () => {
        //const token =  this.props.auth.token;
        fetch(`${base_url}/manager`, {
            headers: {
                'Content-Type': 'application/json',
                // 'auth-token': token
            }
        })
            .then(response => response.json())
            .then(jsonResponse => {
                this.setState({
                    managerList: jsonResponse.message
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

    removeManager = (id) => {
        fetch(`${base_url}/manager/delete/`+id, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': this.props.auth.token
            },
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
                this.getManagers();
            })
            .catch(error => {
                console.log(error);
            })

    }

    render() {

        return (
            <div class="container">
                <h4>Available Store Managers</h4>
                <table className="table table-striped">
                    <thead class="thead-dark">
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    {
                        this.state.managerList.map(manager => {
                            return(
                                <tbody>
                                <tr>
                                    <td>{manager.firstName}</td>
                                    <td>{manager.lastName}</td>
                                    <td>{manager.email}</td>
                                    <td>{this.formatDate(manager.createdAt)}</td>
                                    <td><button type="button" onClick={()=>this.removeManager(manager._id)} className="btn btn-danger"><i className="fa fa-trash"/></button></td>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagerTable);