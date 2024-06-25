import { EmailResponseType } from '../model/email.types';
import { EmailService } from './email.service';

describe('EmailService', () => {
  const emailService = new EmailService();

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(EmailService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(emailService).toBeDefined();
  });

  describe('getData', () => {
    it('should be the public method getData in the class when instantiated', () => {
      // arrange
      const emailService = new EmailService();
      let response: null | EmailResponseType = null;
      const expectedResult: EmailResponseType = { message: 'email' };
      // act
      response = emailService.getData();
      // assert
      expect(emailService.getData).toBeDefined();
    });

    it('should return the correct response object when called', () => {
      // arrange
      const emailService = new EmailService();
      let response: null | EmailResponseType = null;
      const expectedResult: EmailResponseType = { message: 'email' };
      // act
      response = emailService.getData();
      // assert
      expect(response).toEqual(expectedResult);
    });
  });
});
