import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { StyleSheet, css } from 'glamor/aphrodite';
import { keyframes } from 'glamor';

class GlobalModal extends React.Component {
  static propTypes = {
    modal: PropTypes.object,
  };

  state = {
    isLoaded: false,
    isNotFound: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.modal && !prevProps.modal) {
      window.history.pushState(null, null, `?modal=${this.props.modal.content}`);
      window.addEventListener('popstate', this._handlePopState);
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
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

  _handlePopState = () => {
    this.props.dispatch({
      type: 'CLEAR_MODAL',
    });
  };

  _dismissModal = () => {
    if (!this.props.modal) {
      return;
    }

    this.setState({ isLoaded: false, isNotFound: false }, () => {
      window.history.go(-1);
      window.removeEventListener('popstate', this._handlePopState);

      this.props.dispatch({
        type: 'CLEAR_MODAL',
      });
    });
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
        className={css(styles.globalModal)}
        onClick={this._dismissModal}>
        {this.state.isLoaded ? (
          <img
            src={this.props.modal.content}
            className={css(styles.globalModalContent, styles.globalModalContentImage)}
          />
        ) : (
          <div className={css(styles.globalModalContent)}>
            {this.state.isNotFound ? 'Image failed to load' : 'Loading'}
          </div>
        )}
      </div>
    );
  }
}

let fadeInKeyframes = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

let styles = StyleSheet.create({
  fadeIn: { animation: fadeInKeyframes },
  globalModal: {
    animation: `${fadeInKeyframes} 200ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
    position: 'fixed',
    background: 'rgba(0, 0, 0, 0.9)',
    color: '#FFFFFF',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  globalModalContent: {
    display: 'block',
    maxHeight: '80%',
    maxWidth: '80%',
    textAlign: 'center',
    fontSize: '1.4rem',
  },
  globalModalContentImage: {
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
  },
});

export default connect(state => {
  return { modal: state.modal };
})(GlobalModal);
