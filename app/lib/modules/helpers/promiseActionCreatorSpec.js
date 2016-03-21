import nock from 'nock';
import promiseActionCreator from './promiseActionCreator';
import mockStore from '../../../test/helpers/mock/mockStore';

import {expect} from 'chai';
import {get as getAttribute} from 'lodash';

let rootUrl = 'http://localhost';

describe('when we create a basic action using the promiseActionCreator that resolves to json', () => {
  let action,
      marketsCall,
      createMarketsRequestActionAssertion = (optional) => {
        return (action) => {
          expect(action.type).to.equal('MARKETS_REQUEST');
          expect(action.promise).to.be.instanceOf(Promise);

          if (optional) {
            Object.keys(optional).forEach(function(key) {
              let value = optional[key];
              expect(getAttribute(action, key)).to.equal(value);
            });
          }
        };
      };

  beforeEach(() => {
    action = promiseActionCreator((marketName) => {
      return fetch(rootUrl + '/markets' + (marketName ? `?query=${marketName}` : ''))
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw error;
          });
        }

        return response.json();
      });
    }, 'markets', {
      actionAttributeNames: ['options.marketName'] // @NOTE: No separate tests for this. Just assertions by having different actions.
    });
  });

  afterEach(() => {
    if (marketsCall && !marketsCall.isDone()) {
      throw new Error('pending mocks -> ' + marketsCall.pendingMocks().join(''));
    }

    nock.cleanAll();
  });

  describe('when a successful response will happen', () => {

    beforeEach(() => {
      marketsCall = nock(rootUrl)
                    .get('/markets')
                    .reply(200, ['BEL20', 'CAC40']);
    });

    // I know, the mockStore is not ideal.
    describe('when no params are passed to the action', () => {

      it('should send a request and finally the loaded actions', (done) => {
        const store = mockStore(
              { markets: [] },
              [
                createMarketsRequestActionAssertion(),
                { type: 'MARKETS_LOADED', payload: ['BEL20', 'CAC40'] }
              ],
              done);

        store.dispatch(action());
      });

    });

    describe('with params to the triggered action', () => {

      beforeEach(() => {
        marketsCall = nock(rootUrl)
                      .get('/markets?query=test')
                      .reply(200, ['BEL20', 'CAC40']);
      });

      it('should send a request and finally the loaded actions', (done) => {
        const store = mockStore(
              { markets: [] },
              [
                createMarketsRequestActionAssertion({'options.marketName':'test'}),
                { type: 'MARKETS_LOADED', payload: ['BEL20', 'CAC40'], options: {marketName: 'test' } }
              ],
              done);

        store.dispatch(action('test'));
      });

    });
  });

  describe('when the markets call will fail', () => {
    let error;

    beforeEach(() => {
      error = {code: 'FAILED'};

      marketsCall = nock(rootUrl)
      .get('/markets')
      .reply(404, error);
    });

    it('should send the request and the failed actions', (done) => {
      const store = mockStore(
            {markets: []},
            [
              function(action) {
                expect(action.type).to.equal('MARKETS_REQUEST');
                expect(action.promise).to.be.instanceOf(Promise);
              },
              { type: 'MARKETS_FAILED', error }
            ],
            done);

      store.dispatch(action());
    });
  });
});

