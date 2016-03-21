import {expect} from 'chai';
import syncActionCreator from './syncActionCreator';

describe('spec for syncActionCreator', () => {

  context('when creating with no configured type', () => {

    it('should complain about no type', () => {
      expect(syncActionCreator).to.throw('A type is needed for each action.');
    });

  });

  context('when creating with an empty type', () => {

    let execute;
    beforeEach(() => {
      execute = () => {
        syncActionCreator('');
      };
    });

    it('should complain about no type', () => {
      expect(execute).to.throw('A type is needed for each action.');
    });

  });

  context('when calling with no configured arguments', () => {

    let result;
    beforeEach(() => {
      result = syncActionCreator('TEST')();
    });

    it('should have type TEST', () => {
      expect(result.type).to.equal('TEST');
    });

  });

  context('when calling with arguments', () => {

    let result;
    beforeEach(() => {
      result = syncActionCreator('TEST', 'one', 'two')('1', 2);
    });

    it('should have type TEST', () => {
      expect(result.type).to.equal('TEST');
    });

    it('should have attribute one set to \'1\'', () => {
      expect(result).to.have.ownProperty('one');
      expect(result.one).to.equal('1');
    });

    it('should have attribute two set to 2', () => {
      expect(result).to.have.ownProperty('two');
      expect(result.two).to.equal(2);
    });

  });

  context('when calling with less arguments than configured', () => {

    let result;
    beforeEach(() => {
      result = syncActionCreator('TEST', 'one', 'two')('1');
    });

    it('should have type TEST', () => {
      expect(result.type).to.equal('TEST');
    });

    it('should have attribute one set to \'1\'', () => {
      expect(result).to.have.ownProperty('one');
      expect(result.one).to.equal('1');
    });

    it('should not have attribute two', () => {
      expect(result).to.not.have.ownProperty('two');
    });

  });

});
