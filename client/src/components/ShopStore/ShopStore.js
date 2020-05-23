import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Products from './Products/Products';
import Header from '../Header/Header';
//import * as authAtions from '../../store/actions/authActions';
import { connect } from "react-redux";




class ShopStore extends Component{

    state={
        categoryTitle: 'Products'
    }

    render() {

        console.log('Parents');
        console.log(this.props);

        return (
            <React.Fragment>
                <Header/>
                <br/>
                <Switch>
                    <Route path="/" exact component={Products} />
                    <Route path="/products" exact component={Products} />
                    <Route path="/products/:slug" component={Products} />
                </Switch>
            </React.Fragment>

        );
    }
}



export default connect(null, null)(ShopStore);