import React, {Component} from 'react';
import {Link} from 'react-router';
import Menu from './Menu';

const Header = () => (
	<div className="header">
		<Link className="header__link" to={'/feed'}>Twitter React Redux feed</Link>
	</div>
);

class Main extends Component {
    render() {
    return (
      <div className="twitter-feed">
      	<Header />
        <Menu />
        <div className="twitter-timeline">
          { this.props.children || <div>Nothing was rendered on this path</div>}
        </div>
      </div>

    )
  }
}

export default Main;
