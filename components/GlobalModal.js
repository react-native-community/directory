import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class GlobalModal extends React.Component {
  static propTypes = {
    modal: PropTypes.object,
  };

  state = {
    isLoaded: false,
    isNotFound: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.modal) {
      return;
    }

    const img = new Image();

    img.onload = () => {
      this.setState({
        isLoaded: true,
        isNotFound: false,
      });
    };

    img.onerror = () => {
      this.setState({
        isLoaded: true,
        isNotFound: true,
      });
    };

    img.src = nextProps.modal.content;
  }

  _dismissModal = () => {
    if (!this.props.modal) {
      return;
    }

    this.props.dispatch({
      type: 'CLEAR_MODAL',
      modal: undefined,
    });

    this.setState({ isLoaded: false, isNotFound: false });
  };

  render() {
    if (!this.props.modal) {
      return null;
    }

    return (
      <div
        ref={m => {
          this._modal = m;
        }}
        className="global-modal"
        onClick={this._dismissModal}>
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          .fadeIn {
            animation-name: fadeIn;
          }

          .global-modal {
            animation: fadeIn 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: #ffffff;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .global-modal-content {
            display: block;
            max-height: 80%;
            max-width: 80%;
            text-align: center;
            font-size: 1.4rem;
          }

          .global-modal-content--image {
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
          }
        `}</style>
        {this.state.isLoaded
          ? <img
              src={this.props.modal.content}
              className="global-modal-content global-modal-content--image"
            />
          : <div className="global-modal-content">
              {this.state.isNotFound ? 'Image failed to load' : 'Loading'}
            </div>}
      </div>
    );
  }
}

export default connect(state => {
  return { modal: state.modal };
})(GlobalModal);
