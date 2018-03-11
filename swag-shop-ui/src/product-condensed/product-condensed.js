/**
 * Created by Ayush on 3/11/2018.
 */
import React, {Component} from 'react';
import './product-condensed.css';

class ProductCondensed extends Component{
    render(){
        return(
            <li className="list-group-item pc-condensed">
                <p>{this.props.product.title} | <b>${this.props.product.price}</b></p>
                <a className="btn btn-sm btn-outline-danger">x</a>
            </li>
        );

    }
}

export default ProductCondensed;