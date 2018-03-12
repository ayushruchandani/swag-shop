/**
 * Created by Ayush on 3/11/2018.
 */
import React, {Component} from 'react';
import './wishlist.css';
import ProductCondensed from '../product-condensed/product-condensed';
import DataService from '../services/data-service';

class Wishlist extends Component{

    constructor(props){
        super(props);

        this.state = {wishList:[{title:"Item 1", price: 23.99, _id:"aibi288"}, {title:"Item 2", price: 22.99, _id:"aiuebubi288"}, {title:"Item 3", price: 563.99, _id:"aib377i288"}]}

        this.createWishList = this.createWishList.bind(this);
    }

    createWishList = () => {
        const list= this.state.wishList.map((product) =>
            <ProductCondensed product={product} key={product._id}/>
        )

        return (list);
    }

    render(){
        return(
            <div class="card">
                <div className="card-block">
                    <h4 className="card-title">Wish List</h4>
                    <ul className="list-group">
                        {this.createWishList()}
                    </ul>
                </div>
            </div>
        );

    }
}

export default Wishlist;