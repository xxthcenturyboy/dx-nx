import {
  API_ERROR,
  APP_DESCRIPTION,
  APP_DOMAIN,
  APP_NAME,
  APP_PREFIX,
  COMPANY_NAME,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_SORT,
  ERROR_MSG,
  ERROR_MSG_API,
  LOCAL_ENV_NAME,
  LOREM,
  PHONE_DEFAULT_REGION_CODE,
  PROD_ENV_NAME,
  STAGING_ENV_NAME
} from './common-config.consts';

describe('API_ERROR', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(API_ERROR).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(API_ERROR).toEqual('Could not complete the request.');
  });
});

describe('APP_DESCRIPTION', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(APP_DESCRIPTION).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(APP_DESCRIPTION).toEqual('Boiler plate nx monorepo: Node, Express, React, Expo, Postgres, Redis');
  });
});

describe('APP_DOMAIN', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(APP_DOMAIN).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(APP_DOMAIN).toEqual('danex.software');
  });
});

describe('APP_NAME', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(APP_NAME).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(APP_NAME).toEqual('Web App Shell');
  });
});

describe('APP_PREFIX', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(APP_PREFIX).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(APP_PREFIX).toEqual('dx');
  });
});

describe('COMPANY_NAME', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(COMPANY_NAME).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(COMPANY_NAME).toEqual('Danex Software');
  });
});

describe('DEFAULT_LIMIT', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DEFAULT_LIMIT).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(DEFAULT_LIMIT).toEqual(10);
  });
});

describe('DEFAULT_OFFSET', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DEFAULT_OFFSET).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(DEFAULT_OFFSET).toEqual(0);
  });
});

describe('DEFAULT_SORT', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DEFAULT_SORT).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(DEFAULT_SORT).toEqual('ASC');
  });
});

describe('ERROR_MSG', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(ERROR_MSG).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(ERROR_MSG).toEqual('Oops! Something went wrong. It\'s probably nothing you did and most likely our fault. There may be additional info for this message.');
  });
});

describe('ERROR_MSG_API', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(ERROR_MSG_API).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(ERROR_MSG_API).toEqual('Oops! Something went wrong. It\'s probably nothing you did and most likely our fault. If it happens many times, please contact support.');
  });
});

describe('LOCAL_ENV_NAME', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(LOCAL_ENV_NAME).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(LOCAL_ENV_NAME).toEqual('development');
  });
});

describe('LOREM', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(LOREM).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(LOREM).toEqual("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum");
  });
});

describe('PHONE_DEFAULT_REGION_CODE', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(PHONE_DEFAULT_REGION_CODE).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(PHONE_DEFAULT_REGION_CODE).toEqual('US');
  });
});

describe('PROD_ENV_NAME', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(PROD_ENV_NAME).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(PROD_ENV_NAME).toEqual('production');
  });
});

describe('STAGING_ENV_NAME', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(STAGING_ENV_NAME).toBeDefined();
  });

  it('should have the correct value', () => {
    // arrange
    // act
    // assert
    expect(STAGING_ENV_NAME).toEqual('staging');
  });
});
