// URL regexes to rewrite bypass CORB for
const CORBWhitelist = []

export const getHeaders = (url, headers) => {
  return CORBWhitelist.filter(hostRegex => url.match(hostRegex)).length > 0 ?
    headers.map(item => item.name.toLowerCase() === 'Access-Control-Allow-Origin'.toLowerCase() ? { ...item, value: '*' } : item) :
    headers
}
