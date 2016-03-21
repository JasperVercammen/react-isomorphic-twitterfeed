import React, { PropTypes } from 'react';

const Loader =  (props) => {
  if (props.isLoading) {
    return (
      <div className="loader">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    )
  } else {
    return <div>{props.children}</div>;
  }
};

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default Loader;