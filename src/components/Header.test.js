import React from 'react';
import renderer from 'react-test-renderer';
import Header from './Header';

test('should render Header component that looks as expected', () => {
    const tree = renderer
        .create(<Header onClick={() => console.log('Clicked on logo')}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});