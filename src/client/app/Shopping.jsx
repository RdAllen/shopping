import React from 'react';
import Nodata from './Nodata.jsx';
import ReactDOM from 'react-dom';
import CommonClass from './Common.jsx';
import ModalWindow from './ModalWindow.jsx';

class ShoppingContent extends CommonClass {

  render() {

    return (
      <div key={this.props.content.p_id}>
          <div className="row hr"></div>
          <div className="row">
              <div className="col-md-10">
                  <div className="col-md-4">
                    <img src={this.props.imgPath + this.props.content.image} className={(this.props.content.image) ? 'show' : 'hide'} />
                  </div>
                  <div className="col-md-6">
                        <div className="row">
                          <h5>{this.props.content.p_name}</h5>
                        </div>
                        <div className="row">
                          <strong>Style:</strong> {this.props.content.p_style} 
                        </div>
                        <div className="row">
                          <strong>Colour:</strong> {(this.props.content.p_selected_color) ? this.props.content.p_selected_color.name : ""}
                        </div>
                        <div className="row">
                          <strong>Size:</strong> {(this.props.content.p_selected_size) ? this.props.content.p_selected_size.code : ""}
                        </div>
                        <div className="row">
                          <strong>Qty:</strong> {this.props.content.p_quantity}
                        </div>
                        <div className="row">
                          <strong>Price:</strong> {this.props.content.c_currency}{this.props.content.p_price}
                        </div>
                        <div className="row">
                          <p>
                              <button className="btn btn-sm btn-default marginSml" data-toggle="modal" data-target="#shoppingDataView" onClick={this.props.parentThis.editItem.bind(null, this.props.content, this.props.index)}>Edit</button> 

                              <button className="btn btn-sm btn-default marginSml" onClick={this.props.parentThis.removeItem.bind(null, this.props.index)}>Remove</button>

                          </p>
                        </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}

class Shopping extends CommonClass {
   constructor(props){
  	super(props);
  	this.state = {
      shoppingData: [],
      promoCode: '', // no requirement so far to use promo code
      discount: 0,
      shippingCharge: 0,
      total: 0,
      modalContent: '',
      editIndex: null,
      iqty:1,
      isize: '',
      error: ''
    };

  	this.callbackShopping = this.callbackShopping.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.itemView = this.itemView.bind(this);
    this.saveItemDetail = this.saveItemDetail.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleQty = this.handleQty.bind(this);
  }

  callbackShopping(response) {
    if (response && 'undefined' != response.productsInCart) {
      this.setState({shoppingData: response.productsInCart});
      this.calculateTotal();
    } else {
      this.setState({shoppingData: []});
    }
  }

  componentDidMount() {
    let callbackInfo = {obj: this, callback: 'callbackShopping'};
    this.serverRequest = this.http(this.props.apiShoppingCart,'GET',{}, callbackInfo);
  }

  componentWillUnmount() {
  	 this.serverRequest.abort();
  }

  removeItem(index) {
    this.setState({editIndex: null});
    let arr = this.state.shoppingData.splice(index,1);
    this.calculateTotal();
  }

  editItem(obj, itemIndex) {

    this.setState({
      modalContent: (parseInt(itemIndex) >= 0) ? this.itemView() : '', 
      editIndex: itemIndex,
      iqty: (parseInt(itemIndex) >= 0) ? this.state.shoppingData[itemIndex].p_quantity: 1,
      isize: (parseInt(itemIndex) >= 0) ? this.state.shoppingData[itemIndex].p_selected_size.name: '',
      error: ''
    });
  }

  calculateTotal() {

    var totalItems = this.state.shoppingData.length;
    var totalAmount = 0;
    var currency = (totalItems) ? this.state.shoppingData[0].c_currency : '$'; // default

    this.state.shoppingData.forEach( (obj) => {
        let price = parseFloat(obj.p_price) * parseInt(obj.p_quantity);
        totalAmount = parseFloat(totalAmount) + price;
    });

    // shipping calculations if any
    var shippingCharge = 0;

   /*

   // < 3 items, discount 5%
   // 4-9 items, discount 10%
   //  >10 items, discount 25%
   //we can keep all discounts criteria in config somewhere

   */
    
    var discount = 0;
    if (totalItems && totalAmount) {
       if(totalItems > 9) {
          discount = totalAmount * 0.25;
       } else if(totalItems > 3 && totalItems <= 9) {
          discount = totalAmount * 0.10;
       } else if(totalItems == 3) {
          discount = totalAmount * 0.05;
       }
    }

    totalAmount = totalAmount + shippingCharge - discount;
    totalAmount = totalAmount.toFixed(2);
    discount = discount.toFixed(2);

    this.setState({discount: currency+ " " +discount, total: currency+ " " +totalAmount, shippingCharge: !(shippingCharge) ? 'Free' : (currency+ " " +shippingCharge) });
  }

  /*applyPromo() {
    console.log("To Do - Promo Code");
    //this.calculateTotal();
  }

  promoCode() {
    return (
          <div className="row col-md-10">
              <div className="col-md-5">Enter promotion code or Gift Card</div>
              <div className="col-md-5">
                <input type="text" ref="promoCode" id="promoCode" className="marginSml input-sm" /> 
                <button className="btn btn-sm btn-default" onClick={this.applyPromo}> Apply </button> 
              </div>
          </div>
      );
  }*/

  saveItemDetail(e) {
    e.preventDefault();
    if ('' == this.state.isize) {
      this.setState({error: 'Please enter Size'});
      return;
    }
    if ('' == this.state.iqty) {
      this.setState({error: 'Please select quantity'});
      return;
    }

    var obj = this.state.shoppingData[this.state.editIndex];
    obj.p_quantity = this.state.iqty;
    //obj.p_selected_size["name"] = this.state.isize; // to do later

    this.state.shoppingData[this.state.editIndex] = obj;
    this.calculateTotal();
    $("#shoppingDataView").modal("hide");
  }

  handleQty(e) {
    this.setState({iqty: e.target.value});
  }

  handleSize(e) {
    this.setState({isize: e.target.value});
  }

  itemView() {

    var itemName,itemPrice;

    if (null != this.state.editIndex ) {
      itemName = this.state.shoppingData[this.state.editIndex].p_name ;
      itemPrice = this.state.shoppingData[this.state.editIndex].c_currency+this.state.shoppingData[this.state.editIndex].p_price;
    }
    //this.setState({qty: itemQty, size: itemSize});

    return (
      <div>
        <div className="row">
         <div className="col-md-12">
             <form method="post" name="shoppingBagForm">
                <div className="col-md-8">
                    <div className="row">
                        <h3>{itemName}</h3>
                    </div>
                    <div className="row">
                        <h2>{itemPrice}</h2>
                    </div>
                    <div className="row">
                        <div className="col-md-3 marginLarge">Size: <input type="text" size="4" id="itemSize" ref="itemSize" onChange={this.handleSize}  value={this.state.isize} readOnly /></div>
                        <div className="col-md-3 marginLarge">Qty: <input type="text" size="4" id="itemSize" ref="itemQty" onChange={this.handleQty} value={this.state.iqty} /></div>
                    </div>
                    <div className="row">
                        <button className="btn btn-sm btn-primary marginLarge" onClick={this.saveItemDetail}>Edit</button>
                    </div>
                </div>
                <div className="col-md-4"><img src={ (null != this.state.editIndex) ? (this.props.imgPath + this.state.shoppingData[this.state.editIndex].image) : '' } className={(null != this.state.editIndex) ? 'show' : 'hide'} /></div>
             </form>
         </div>
        </div>
      </div>
    );
  }

  render () {

  	var shoppingBag = this.state.shoppingData.map( (i, index) => {
  			return (
            <ShoppingContent content={i} key={index} index={index} parentThis={this} />
  				)
  		}, this);

    return (
    	<div>
 	    		<div className="clear">
            <div className="row">
              <div className="col-md-10">
                <div className="col-md-10"><h4>Items</h4></div>
              </div>
            </div>
			    	{shoppingBag}
			    	<Nodata show={shoppingBag.length > 0 ? false : true } />
            <div className="row hr"></div>

            <div className="row">
              <div className="col-md-12 shoppingBottom">
                  <div className="col-md-4 contactShopping">
                    <div className="row">
                      <strong>Need help or have Questions? </strong>
                    </div>
                    <div className="row">
                      call Customer Service at <div>1-800-555-5555</div>
                    </div>  
                  </div> 
                  <div className="col-md-8 shoppingTotal"> 
                      
                      <div className="row col-md-10">
                          <div className="col-md-5">Discount</div>
                          <div className="col-md-5"><strong>{this.state.discount}</strong></div>
                      </div>
                      <div className="row col-md-10">
                          <div className="col-md-5">Estimated Shipping</div>
                          <div className="col-md-5"><strong>{this.state.shippingCharge}</strong></div>
                      </div>
                      <div className="row col-md-10">
                          <div className="col-md-5"><h3>Estimated Subtotal</h3></div>
                          <div className="col-md-5"><h3>{this.state.total}</h3></div>
                      </div>
                  </div>
              </div>
            </div>
            <ModalWindow parentThis={this} modalId="shoppingDataView" modalHeader="" />

		    	</div>
		  </div>
		);
  }
}

export default Shopping;