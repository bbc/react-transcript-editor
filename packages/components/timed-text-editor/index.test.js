import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import TimeTextEditor from './index';

describe('<TimeTextEditor />', () => {
  it('renders three <Foo /> components', () => {
    const wrapper = shallow(<TimeTextEditor />);
    expect(wrapper.find(TimeTextEditor)).to.have.lengthOf(3);
  });

  it('renders an `.icon-star`', () => {
    const wrapper = shallow(<TimeTextEditor />);
    expect(wrapper.find('.icon-star')).to.have.lengthOf(1);
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <TimeTextEditor>
        <div className="unique" />
      </TimeTextEditor>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<TimeTextEditor onButtonClick={ onButtonClick } />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});