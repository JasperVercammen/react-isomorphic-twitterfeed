"use strict";
import 'babel-polyfill'
import {expect} from 'chai';
import promiseActionReducer from './promiseActionReducer';

/**
 * Created by mobinni on 16/12/15.
 */

describe('promiseActionReducer', () => {
  let reducer;

  describe('When we create a new reducer', () => {
    beforeEach(() => {
      reducer = (state, action) => {
        switch (action.type) {
          case 'SUCCESS':
          case 'WORKED':
            return 'done';
          default:
            return state;
        }
      }
    });

    describe('When we wrap it in a promiseActionReducer', () => {
      let promiseReducer;
      beforeEach(() => {
        promiseReducer = promiseActionReducer({
          request: 'REQUEST',
          success: ['SUCCESS', 'WORKED'],
          error: 'FAILED'
        })(reducer);
      });

      describe('When we pass a request action', () => {
        let result;
        beforeEach(() => {
          result = promiseReducer(undefined, {type: 'REQUEST'});
        });
        it('should return an object with a loading state', () => {
          expect(result).to.deep.equal({
            failed: false,
            loading: true,
            success: false
          });
        });
      });


      describe('When we pass a failed action', () => {
        let result;
        beforeEach(() => {
          result = promiseReducer([], {type: 'FAILED'});
        });

        it('should return an object with a failed state', () => {
          expect(result).to.deep.equal({
            failed: true,
            loading: false,
            success: false,
            data: undefined
          });
        });
      });

      describe('When we pass a success action', () => {
        let result;
        beforeEach(() => {
          result = promiseReducer(undefined, {type: 'SUCCESS'});
        });

        it('should return an object with a success state', () => {
          expect(result).to.deep.equal({
            failed: false,
            loading: false,
            success: true,
            data: 'done'
          });
        });

        describe('when we pass an error action afterwards', () => {

          beforeEach(() => {
            result = promiseReducer(result, {type: 'FAILED'});
          });

          it('we expect the data to be undefined', () => {
            expect(result.data).to.be.undefined;
          });

        });
      });

      describe('When we pass a success action of a different type', () => {
        let result;
        beforeEach(() => {
          result = promiseReducer(undefined, {type: 'WORKED'});
        });

        it('should return an object with a success state', () => {
          expect(result).to.deep.equal({
            failed: false,
            loading: false,
            success: true,
            data: 'done'
          });
        });

      });
    });

    describe('when we wrap it in a promiseAcionReducer with an augmentState', () => {

      let promiseReducer;
      beforeEach(() => {
        promiseReducer = promiseActionReducer({
          request: 'REQUEST',
          success: 'SUCCESS',
          error: 'FAILED'
        }, {
          augmentState: function(state, action) {
            return Object.assign({}, state, {content: action.name});
          }
        })(reducer);
      });

      describe('when we fire off an action', () => {

        let result;
        beforeEach(() => {
          result = promiseReducer([], {type: 'SUCCESS', name: 'test'});
        });

        it('should have augmented the state', () => {
          expect(result.content).to.equal('test');
        });

      });

    });
  });
});
