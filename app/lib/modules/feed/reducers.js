import {constants} from './constants';

function twitterfeed(state = [], action) {
  switch(action.type) {
    case constants.GET_TWEETS_REQUEST:
      return {
        tweets: [],
        isLoading: true
      };
    case constants.GET_TWEETS_LOADED:
      return {
        tweets: action.payload,
        isLoading: false
      };
    case constants.GET_TWEETS_FAILED:
      return {
        tweets: [{text: 'An error occured while fetching tweets.'}],
        isLoading: false
      };
    default:
      return state;
  }
}


function feeds(state = {}, action) {
  switch (action.type) {
    case 'get': return action.payload;
    default: return state;
  }
}

export default {
  feeds,
  twitterfeed
}