import React, {Component} from "react";
import {base_url} from "../../../constants";
import * as authActions from "../../../store/actions/authActions";
import {connect} from "react-redux";

class CategoryTable extends Component{

    state = {
        categoryList: []
    }

    componentDidMount(){
        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
                .then(result => {
                    if(result){
                        this.getCategories();
                    }else{
                        this.props.history.push('/login');
                    }
                })
        }else{
            this.getCategories();
        }
    }

    componentDidUpdate(){
        this.getCategories()
    }

    getCategories = () => {
        const token =  this.props.auth.token;
        fetch(`${base_url}/category`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        })
            .then(response => response.json())
            .then(jsonResponse => {
                this.setState({
                    categoryList: jsonResponse.message
                });
            })
            .catch(error => {
                console.log(error);
            })

    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.state.categoryList !== nextState.categoryList){
            return true
        }
    }

    formatDate = (date) => {
        let d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    render() {

        return (
                <div class="container">
                        <h4>Available Categories</h4>
                        <table className="table table-striped">
                            <thead class="thead-dark">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Keyword</th>
                                <th scope="col">Created Date</th>
                                <th scope="col">Sub Categories</th>
                            </tr>
                            </thead>
                            {
                                this.state.categoryList.map(categories => {
                                    return(
                                        <tbody>
                                        <tr>
                                            <td>{categories._id}</td>
                                            <td>{categories.name}</td>
                                            <td>{categories.slug}</td>
                                            <td>{this.formatDate(categories.createdAt)}</td>
                                            <td>{categories.children.map(sub =>{
                                                return(<p>{sub.name}</p>)
                                            })
                                            }</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryTable);