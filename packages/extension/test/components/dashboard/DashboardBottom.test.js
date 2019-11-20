import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { shallow } from 'enzyme'
import DashboardBottom from '../../../src/components/dashboard/DashboardBottom.jsx'

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const getComponent = (props = {}) => {
  /* eslint-disable react/prop-types */
  return (
    <DashboardBottom
      logs={props.logs || []}
      screenshots={props.screenshots || []}
      clearLogs={props.clearLogs || jest.fn()}
      clearScreenshots={props.clearScreenshots || jest.fn()}
      /* eslint-enable react/prop-types */
    />
  )
}


describe('DashboardBottom', () => {
  it('renders', () => {
    const { getByText } = render(getComponent())
    getByText('Logs')
    getByText('Screenshots')
    getByText('Clear')
  })
  it('componentWillReceiveProps - logs size is equal', () => {
      const props = {
          logs: [{
              type: 'info',
              text: 'test-name'
          }]
      }
      const component = shallow(getComponent(props))
      const logs = [
          {
              type: 'error',
              text: 'test-name'
          }]
      component.setProps({logs})
  })
    it('componentWillReceiveProps - logs size increased', () => {
        const props = {
            logs: [{
                type: 'info',
                text: 'test-name'
            }]
        }
        const component = shallow(getComponent(props))
        const logs = [{
            type: 'info',
            text: 'test-name'
        },
            {
                type: 'error',
                text: 'test-name'
            }]
        component.setProps({logs})
    })
  it('Clear screenshots', () => {
      const mockClick = jest.fn()
      const props = {
          screenshots: [{
              url: 'test.com',
              createTime: '1571879106',
              name: 'test-name'
          }],
          clearScreenshots: mockClick

      }
      const wrapper = shallow(getComponent(props))
      wrapper.setState({activeTabForLogScreenshot: 'Screenshots'})
      expect(wrapper.find('li').length).toBe(1)
      wrapper.find('Button').simulate('click')
      expect(mockClick.mock.calls.length).toBe(1)
  })
    it('Clear logs', () => {
        const mockClick = jest.fn()
        const props = {
            logs: [{
                type: 'info',
                text: 'test-name'
            }],
            clearLogs: mockClick

        }
        const wrapper = shallow(getComponent(props))
        expect(wrapper.find('li').length).toBe(1)
        wrapper.find('Button').simulate('click')
        expect(mockClick.mock.calls.length).toBe(1)
    })
   it('Select tab', () => {
       const props = {
           screenshots: [{
               url: 'test.com',
               createTime: '1571879106',
               name: 'test-name'
           }]
       }
       const wrapper = shallow(getComponent(props))
       wrapper.find('Tabs').simulate('change','Screenshots')
       expect(wrapper.state('activeTabForLogScreenshot')).toBe('Screenshots')

    })

    it('Select option Info', () => {
        const props = {
            logs: [{
                type: 'info',
                text: 'test-name'
            },
                {
                    type: 'error',
                    text: 'test-name'
            }]

        }
        const wrapper = shallow(getComponent(props))
        wrapper.find('Select').simulate('change','Info')
        expect(wrapper.find('Select').props().value).toBe('Info')
    })

    it('Select option Error', () => {
        const props = {
            logs: [{
                type: 'info',
                text: 'test-name'
            },
                {
                    type: 'error',
                    text: 'test-name'
                }]

        }
        const wrapper = shallow(getComponent(props))
        wrapper.find('Select').simulate('change','Error')
        expect(wrapper.find('Select').props().value).toBe('Error')
    })

  // TODO more tests ...
})
