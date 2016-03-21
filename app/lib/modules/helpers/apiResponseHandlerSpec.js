import {expect} from 'chai';
import nock from 'nock';
import apiResponseHandler from './apiResponseHandler';

let rootUrl = 'http://localhost';

describe('apiResponseHandler', () => {
  let call,
      result;

  describe('when we hook in the apiResponseHandler in a fetch promise', () => {
    beforeEach(() => {
      call = () => {
        return fetch(rootUrl + '/')
           .then(apiResponseHandler);
      };
    });

    describe('when we have a succesful response', () => {
      const data = {
        dummy: true
      };

      beforeEach(() => {
        nock(rootUrl)
        .get('/')
        .reply(200, data);

        result = call();
      });

      it('should be a promise', () => expect(result).to.be.instanceof(Promise));
      it('should respond with the data json', () => expect(result).to.eventually.deep.equal(data));

    });

    describe('when we have an error response', () => {

      const error = {code: 'boom'};

      beforeEach(() => {
        nock(rootUrl)
        .get('/')
        .reply(400, error);

        result = call();
      });

      it('should be a promise', () => expect(result).to.be.instanceof(Promise));
      it('should reject the result', () => expect(result).to.eventually.be.rejectedWith(error) );

    });
  });

});

