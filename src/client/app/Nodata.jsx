import React from 'react';

export default class Nodata extends React.Component {
  render () {
    return (
    		<div className={this.props.show ? 'show' : 'hide' }>
				No item added yet
			</div>
			);
  }
}