import React, { Fragment, Component } from 'react';
import Modal from '../components/Modal/Modal';
import BackDrop from '../components/Backdrop/BackDrop';

import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false
  }

  createEventHandler = () => {
    this.setState({
      creating: true
    });
  }

  modalConfirmHandler = () => {
    this.setState({ creating: false });
  }

  modalCanceandler = () => {
    this.setState({ creating: false });
  }

  render() {
    const { creating } = this.state;

    return (
      <Fragment>
        {creating && (
          <Fragment>
            <BackDrop />
            <Modal
              title="Add Event"
              canCancel
              canConfirm
              onCancel={this.modalCanceandler}
              onConfirm={this.modalConfirmHandler}
            >
              <div>Modal Content!</div>
            </Modal>
          </Fragment>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.createEventHandler}>Create Event</button>
        </div>
      </Fragment>
    );
  }
}

export default EventsPage;