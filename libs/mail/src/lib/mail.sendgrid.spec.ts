import {
  MailSendgrid,
  MailSendgridType
} from './mail.sendgrid';
import { ApiLoggingClass } from '@dx/logger';

jest.mock('@dx/logger');

describe('MailSendgrid', () => {
  let mail: MailSendgridType;

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'unit-test' });
  });

  beforeEach(() => {
    mail = new MailSendgrid();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(MailSendgrid).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(mail).toBeDefined();
    expect(mail.logger).toBeDefined();
    expect(mail.sendConfirmation).toBeDefined();
    expect(mail.sendInvite).toBeDefined();
    expect(mail.sendOtp).toBeDefined();
    expect(mail.sendReset).toBeDefined();
  });

  test('should sendConfirmation when invoked', async () => {
    // arrange
    // act
    const result = await mail.sendConfirmation('test@email.com', 'http://url-to-comfirm.com');
    // assert
    expect(result).toBeDefined();
    expect(typeof result).toEqual('string');
  });

  test('should sendInvite when invoked', async () => {
    // arrange
    // act
    const result = await mail.sendInvite('test@email.com', 'http://url-to-invite.com');
    // assert
    expect(result).toBeDefined();
    expect(typeof result).toEqual('string');
  });

  test('should sendReset when invoked', async () => {
    // arrange
    // act
    const result = await mail.sendReset('test@email.com', 'http://url-to-reset.com');
    // assert
    expect(result).toBeDefined();
    expect(typeof result).toEqual('string');
  });

  test('should sendOtp when invoked', async () => {
    // arrange
    // act
    const result = await mail.sendOtp('test@email.com', 'otp-code', 'http://url-to-lockout.com');
    // assert
    expect(result).toBeDefined();
    expect(typeof result).toEqual('string');
  });
});
