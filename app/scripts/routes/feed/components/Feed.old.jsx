/**
 * Created by mobinni on 08/12/15.
 */
import React, {Component} from 'react';
import {Link} from 'react-router';
import feed from '../../../../lib/modules/feed';
import {connect} from 'react-redux';

import '../../../../styles/components/feed.scss';

class Feed extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const dispatch = this.props.dispatch;
    //dispatch(feed().actions.loadFeeds());
  }

  render() {
    const {feeds} = this.props || [];
    console.log(this.props);
    console.log(feeds);
    const activeFeedState = feeds.map((feed, i) => {
      //if (  )
    });
    return (
      <div>
        <ul>
          {
            feeds.map((feed, i) => {
              return (<span>{feed}</span>)
            })
          }
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {feeds: state.feeds}
}


export default connect(mapStateToProps)(Feed);
