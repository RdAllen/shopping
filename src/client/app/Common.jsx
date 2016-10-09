import React from 'react';

class Common extends React.Component {
  constructor(props) {
  	super(props);
  }

  http(url, method, data, callbackInfo) {
  	return $.ajax({
		url: url,
		method: method,
		data: ('GET' == method) ? $.param(data) : data,
		processData: false,
  		contentType: false, // to consider content type for file upload
		success: function(response) {
			for(let objAttr in callbackInfo.obj) {
				if (callbackInfo.callback == objAttr) {
				  callbackInfo.obj[objAttr](response);
				  return;
				}
			 };
		},
		error: function (xhr, ajaxOptions, thrownError) {
        	console.log(xhr.status);
        	console.log(thrownError);
        }
	});
  }
}

Common.defaultProps = {
   imgPath: "../../public/assets/",
   apiShoppingCart: 'http://localhost:8080/cart.json'
}

export default Common;