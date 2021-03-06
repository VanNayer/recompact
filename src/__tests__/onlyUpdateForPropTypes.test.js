import PropTypes from 'prop-types'
import React from 'react'
import { mount, shallow } from 'enzyme'
import { Dummy } from './utils'
import {
  compose,
  onlyUpdateForPropTypes,
  setPropTypes,
  withProps,
  withState,
} from '../'

describe('onlyUpdateForPropTypes', () => {
  it('only updates for props specified in propTypes', () => {
    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      withState('foobar', 'updateFoobar', 'foobar'),
      onlyUpdateForPropTypes,
      setPropTypes({ counter: PropTypes.number }),
    )(Dummy)

    const dummy = mount(<Counter />).find(Dummy)
    const { updateCounter, updateFoobar } = dummy.props()

    expect(dummy.prop('counter')).toBe(0)
    expect(dummy.prop('foobar')).toBe('foobar')

    // Does not update
    updateFoobar('barbaz')
    expect(dummy.prop('counter')).toBe(0)
    expect(dummy.prop('foobar')).toBe('foobar')

    updateCounter(42)
    expect(dummy.prop('counter')).toBe(42)
    expect(dummy.prop('foobar')).toBe('barbaz')
  })

  it('should be merged with other hoc', () => {
    const Component = compose(
      setPropTypes({ foo: PropTypes.string }),
      withProps({ foo: 'bar' }),
      onlyUpdateForPropTypes,
    )(Dummy)

    const wrapper = shallow(<Component />)
    expect(wrapper.instance().constructor.displayName).toBe(
      'withProps(onlyUpdateForPropTypes(Dummy))',
    )
    expect(wrapper.equals(<Dummy foo="bar" />)).toBeTruthy()
  })
})
