import { getHeaders } from '../../src/common/network'

describe('network', () => {
  describe('getHeaders', () => {
    it('should return same headers for URL not in CORB whitelist', () => {
      const headers = [
        {
          name: 'Authorization',
          value: 'apikey'
        },
        {
          name: 'Access-Control-Allow-Origin',
          value: 'example.com'
        }
      ]
      expect(getHeaders('https://app.example.com', headers)).toEqual(headers)
    })
    it('should return same headers for URL in CORB whitelist if it doesn\'t have the CORS header', () => {
      const headers = [
        {
          name: 'Authorization',
          value: 'apikey'
        }
      ]
      expect(getHeaders('https://app.example.com', headers)).toEqual(headers)
    })
    it('should rewrite CORS header for whitelisted domain', () => {
      const headers = [
        {
          name: 'Authorization',
          value: 'apikey'
        },
        {
          name: 'Access-Control-Allow-Origin',
          value: '*'
        }
      ]
      const expectedHeaders = [
        {
          name: 'Authorization',
          value: 'apikey'
        },
        {
          name: 'Access-Control-Allow-Origin',
          value: '*'
        }
      ]
      expect(getHeaders('https://another.app.example.com/api/endpoint', headers)).toEqual(expectedHeaders)
    })
  })
})
