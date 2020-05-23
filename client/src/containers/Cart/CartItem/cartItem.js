import React from 'react';
import QuantityControl from '../../../components/QuantityControl/quantityControl';

import './cartitem.styles.css';


const CartItem = props => {

    return (
        <div className="SingleItem">
            <div className="ItemWrapper">
                <div className="ItemImage" style={{width: '80px', height: '80px', overflow: 'hidden', position: 'relative'}}>
                    <img style={{maxWidth: '100%', maxHeight: '100%', position: 'absolute', left: '50%', transform: 'translateX(-50%)'}} src={props.image} alt="" />
                </div>
                <div className="ItemDetails">
                    <p className="ItemName">{props.name}</p>
                    <p className="ItemPrice">${props.total}</p>
                </div>
            </div>
            <div className="CartActionButtons">
                <QuantityControl
                    productId={props.productId}
                    name={props.name}
                    quantity={props.quantity}
                    changeQuantity={props.changeQuantity}
                    increaseQuantity={props.increaseQuantity}
                    decreaseQuantity={props.decreaseQuantity}
                />
                 <button onClick={props.removeItem} className="btn btn-dark btn-sm"  >REMOVE</button>
                {/*<button className="btn btn-dark btn-sm" onClick={clearCart()} >REMOVE</button>*/}


            </div>
        </div>
    )
}

export default CartItem;