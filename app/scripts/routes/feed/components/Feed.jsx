/**
 * Created by mobinni on 08/12/15.
 */
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import http from 'http';
import Post from '../../../components/Post';
import Loader from '../../../components/helpers/Loader';
import feed from '../../../../lib/modules/feed';
import {isArray} from 'lodash';

class Feed extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this._dispatchTweets(this.props.params.lang);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.lang !== this.props.params.lang) {
      this._dispatchTweets(nextProps.params.lang);
    }
  }

  _dispatchTweets(lang) {
    if (lang) {
      const userlang = lang === 'all' ? '' : lang,
        {dispatch} = this.props,
        actions = feed().actions;
      dispatch(actions.getTweets(userlang, 100));
    }
  }
  render() {
    const {params, tweets, isLoading} = this.props;
    let title = 'Choose your language feed.';
    switch (params.lang) {
      case 'nl':
        title = `Welkom op de NL Twitter feed`;
        break;
      case 'fr':
        title = 'Bienvenue sur la FR Twitter feed';
        break;
      case 'all':
        title = 'Welkom / Bienvenue';
        break;
      default:
        title = 'Kies uw taal / Choisissez votre language';
    }
    let posts = tweets;
    if(!isArray(posts)){
      posts = [];
    }
    return (
      <div>
        <h1>{title}</h1>
        <Loader isLoading={isLoading}>
          <div className="post-list">
            {posts.map(function(status, j) {
              return <Post key={j} {...status} />;
              })
            }
          </div>
        </Loader>
      </div>
    )

  }
}

const mapStateToProps = (state) => {
  if (!state) {
    return {};
  }
  return {
    tweets: state.twitterfeed.tweets,
    isLoading: state.twitterfeed.isLoading
  };
};

Feed.propTypes = {};
Feed.defaultProps = {
  tweets: [],
  isLoading: true
};
//Feed.contextTypes = {
//  modules: PropTypes.object.isRequired
//};

export default connect(mapStateToProps)(Feed);

