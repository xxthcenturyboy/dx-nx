import { MailSendgrid, MailSendgridType } from './mail.sendgrid';
import { ApiLoggingClass } from '@dx/logger-api';
import { TEST_EMAIL } from '@dx/config-shared';
import { SG_TEMPLATES } from './templates.sendgrid';
import { UNSUBSCRIBE_GROUPS } from './mail.sendgrid.const';

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
    expect(mail.sendAccountAlert).toBeDefined();
  });

  test('should sendConfirmation when invoked', async () => {
    // arrange
    // act
    const result = await mail.sendConfirmation(
      TEST_EMAIL,
      'http://url-to-comfirm.com'
    );
    // assert
    expect(result).toBeDefined();
    expect(typeof result).toEqual('string');
  });

  test('should sendInvite when invoked', async () => {
    // arrange
    // act
    const result = await mail.sendInvite(
      TEST_EMAIL,
      'http://url-to-invite.com'
    );
    // assert
    expect(result).toBeDefined();
    expect(typeof result).toEqual('string');
  });

  test('should sendReset when invoked', async () => {
    // arrange
    // act
    const result = await mail.sendAccountAlert({
      to: TEST_EMAIL,
      from: TEST_EMAIL,
      templateId: SG_TEMPLATES.ACCOUNT_ALERT,
      subject: '',
      body: '',
      cta: '',
      ctaUrl: '',
      unsubscribeGroup: UNSUBSCRIBE_GROUPS.TRANSACTIONAL,
    });
    // assert
    expect(result).toBeDefined();
    expect(typeof result).toEqual('string');
  });

  test('should sendOtp when invoked', async () => {
    // arrange
    // act
    const result = await mail.sendOtp(TEST_EMAIL, 'otp-code');
    // assert
    expect(result).toBeDefined();
    expect(typeof result).toEqual('string');
  });
});
