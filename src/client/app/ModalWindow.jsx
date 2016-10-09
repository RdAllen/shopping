import React from 'react';

class ModalWindow extends React.Component {
  constructor(props) {
  	super(props);
  }

  render() {
  	return (
		<div id={this.props.modalId} className="modal fade" role="dialog">
			<div className="modal-dialog">

				<div className="modal-content">
				  <div className="modal-header">
				    <button type="button" className="close" data-dismiss="modal">&times;</button>
				    <h4 className="modal-title">{this.props.modalHeader}</h4>
				  </div>
				  <div className="modal-body">
				    <div className={(this.props.parentThis.state.error && this.props.parentThis.state.error.length > 0) ? 'alert alert-danger' : 'hide'} >{this.props.parentThis.state.error}</div>
				    {this.props.parentThis.itemView()}
				  </div>
				</div>

			</div>
		</div>
  		);
  }

}

export default ModalWindow;