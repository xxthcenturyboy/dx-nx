import { IconNames } from '@dx/ui-web-global-components';
import {
  DASHBOARD_ENTITY_NAME,
  DASHBOARD_MENU,
  DASHBOARD_ROUTES
} from './dashboard.consts';

describe('DASHBOARD_ENTITY_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DASHBOARD_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(DASHBOARD_ENTITY_NAME).toEqual('dashboard');
  });
});

describe('DASHBOARD_MENU ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DASHBOARD_MENU).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    const expectedResult = {
      id: 'menu-dashboard',
      collapsible: false,
      description: '',
      title: 'Dashboard',
      items: [
        {
          id: 'menu-item-dashboard',
          icon: IconNames.DASHBOARD,
          routeKey: DASHBOARD_ROUTES.MAIN,
          title: 'Dashboard',
          type: 'ROUTE',
        },
      ]
    }
    // act
    // assert
    expect(DASHBOARD_MENU).toEqual(expectedResult);
  });
});

describe('DASHBOARD_ROUTES ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DASHBOARD_ROUTES).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(DASHBOARD_ROUTES.MAIN).toEqual('/dashboard');
  });
});
