import React from 'react';
import Home from '../index';
import {Provider} from 'react-redux';
import store from '@global/index';
import renderer from 'react-test-renderer';
import {render, waitFor} from '@testing-library/react-native';
const ReduxWrapper = ({children}: {children: JSX.Element | [JSX.Element]}) => (
  <Provider store={store}>{children}</Provider>
);
jest.mock('@react-navigation/native');

describe('Home', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ReduxWrapper>
          <Home />
        </ReduxWrapper>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly with fetched Mocked', async () => {
    fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({json: () => [response]}));

    const tree = render(
      <ReduxWrapper>
        <Home />
      </ReduxWrapper>,
    );

    await tree.rerender(
      <ReduxWrapper>
        <Home />
      </ReduxWrapper>,
    );

    await waitFor(async () => await expect(tree).toMatchSnapshot());

    tree.unmount();
  });
});

const response = {
  id: 1,
  model: 'Model 3',
  basePrice: '184,000',
  features: [
    {
      id: 1,
      name: 'Performance',
      price: '235,000',
    },
    {
      id: 2,
      name: 'Long Range',
      price: '215,000',
    },
  ],
  exteriorColors: [
    {
      id: 1,
      name: 'Pearl White',
      price: 'Included',
    },
    {
      id: 5,
      name: 'Solid Black',
      price: '4500',
    },
    {
      id: 9,
      name: 'Midnight Silver',
      price: '6000',
    },
    {
      id: 13,
      name: 'Deep Blue',
      price: '6000',
    },
    {
      id: 17,
      name: 'Red Multi-Coat',
      price: '7500',
    },
  ],
  interiorOptions: [
    {
      id: 1,
      name: 'All Black',
      price: 'Included',
    },
    {
      id: 5,
      name: 'Black & White',
      price: '4,500',
    },
  ],
  autopilotOptions: [
    {
      id: 1,
      name: 'Autopilot',
      price: '14,000',
    },
    {
      id: 5,
      name: 'Full self-driving',
      price: '28,000',
    },
  ],
  imageLink:
    'https://static-assets.tesla.com/configurator/compositor?context=design_studio_2&options=$MT322,$PPMR,$W41B,$IBB1&view=STUD_FRONT34&model=m3&size=1920&bkba_opt=2&crop=0,0,0,0&version=v0121-078c13b0d202212151058',
};
