import promiseActionCreator from '../helpers/promiseActionCreator';
import fetch from 'isomorphic-fetch';
import apiResponseHandler from '../helpers/apiResponseHandler';
import {constants} from './constants';



export default class Actions {
  constructor(config) {

    this.loadFeeds = function () {
      return {type: 'get', payload: ['All', 'Only react', 'Only Redux']}
    };

    this.getTweets = function (lang, limit) {
      return function (dispatch) {
        dispatch((function () {
          return {
            type: constants.GET_TWEETS_REQUEST
          }
        })());
        fetch(
          `http://localhost:9000/api/twitter-feed?limit=${limit}&lang=${lang}`,
          {}
        ).then(function (result) {
          if (!result.ok) {
            dispatch((function () {
              return {
                type: constants.GET_TWEETS_FAILED,
                payload: []
              }
            })());
          } else {
            return result.json()
          }
        }).then(function(result) {
          dispatch((function () {
            return {
              type: constants.GET_TWEETS_LOADED,
              payload: result//.statuses
            }
          })())
        });
      }
    }
  }
}
