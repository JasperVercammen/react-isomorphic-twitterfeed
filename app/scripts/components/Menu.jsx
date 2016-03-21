import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

class Menu extends Component {
    render() {
        return (
            <div className="sub-header">
                <ul>
                    <Link className="sub-header__link" to="/feed/all">All</Link>
                    <Link className="sub-header__link" to="/feed/nl">NL</Link>
                    <Link className="sub-header__link" to="/feed/fr">FR</Link>
                </ul>
            </div>
        );
    }
}

export default Menu;