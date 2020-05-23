import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Shop from './containers/Shop/Shop';
import Login from './containers/Login/login';
import Signup from './containers/Signup/signup';
import AddCategory from "./containers/AdminPanel/CategoryManagement/addCategory";
import AddManager from "./containers/AdminPanel/ManagerManagement/addManager";
import AddProducts from "./containers/ManagerPanel/addProducts";
//import ForgetPassword from './ForgetPassword';
//import ControlPanel from './ControlPanel';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducers from './store/reducers/authReducers';
import PrivateRoute from "./PrivateRoute";
import productReducers from './store/reducers/productReducers';
import ProductDetails from './containers/ProductDetails/productDetails';
import Cart from './containers/Cart/cart';
import cartReducers from './store/reducers/cartReducer';

import PlaceOrder from './containers/PlaceOrder/PlaceOrder';
import ThankYou from './containers/ThankYou/thankyou';
import Orders from './containers/Orders/orders';


const rootReducers = combineReducers({
  auth: authReducers,
  products: productReducers,
  cart: cartReducers
});

const store = createStore(rootReducers, applyMiddleware(thunk));

window.store = store;

function App() {
  return (

      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>

              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />

              {/*<Route path="/forget-password" component={ForgetPassword} />*/}
              {/*<Route path="/cpanel" component={ControlPanel} />*/}
              <Route path="/products/:category/:slug" component={ProductDetails} />
              <Route path="/products"  component={Shop} />
              <PrivateRoute path="/cart" component={Cart} />
              <PrivateRoute path="/place-order" component={PlaceOrder} />
              <PrivateRoute path="/thank-you" component={ThankYou} />
              <PrivateRoute path="/orders" component={Orders} />
              <PrivateRoute path="/addproduct" component={AddProducts} />
              <PrivateRoute path="/addcategory" component={AddCategory} />
              <PrivateRoute path="/addmanager" component={AddManager} />
              <Route path="/"  component={Shop} />
            </Switch>


          </div>
        </Router>
      </Provider>



  );
}

export default App;

