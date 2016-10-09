import React from 'react';
import CommonClass from './Common.jsx';
import {render} from 'react-dom';
import Shopping from './Shopping.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

class App extends CommonClass {
  render () {
    return (<div className="container-fluid"> 
    			<Header />
    			<Shopping />
    			<Footer />
    		</div>
    		);
  }
}

render(<App/>, document.getElementById('app'));
