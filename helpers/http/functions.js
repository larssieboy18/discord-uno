const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });

module.exports = {
  /* A function that takes in a method, url, headers, query, and body. It then checks if the method is
  not one of the following: GET, POST, PUT, DELETE, or PATCH. If it is not, it will throw an error.
  If it is, it will return the result of the request. */
  main: async (method, url, headers = {}, query = {}, body = '') => {
    if (method !== GET || method !== POST || method !== PUT || method !== DELETE || method !== PATCH) {
      console.error('Invalid method');
      throw new Error('Invalid method');
    }
    return await lib.http.request['@1.1.7'].main({
      method: method,
      url: url,
      headers: headers,
      queryParams: query,
      body: body
    });
  },
  /*-----*/
  del: async (url, authorization = '', headers = {}, query = {}) => {
    return await lib.http.request['@1.1.7'].del({
      url: url,
      authorization: authorization,
      headers: headers,
      queryParams: query,
    });
  },
  get: async (url, authorization = '', headers = {}, query = {}) => {
    return await lib.http.request['@1.1.7'].get({
      url: url,
      authorization: authorization,
      headers: headers,
      queryParams: query,
    });
  },
  put: async (url, authorization = '', headers = {}, params = {}) => {
    return await lib.http.request['@1.1.7'].put({
      url: url,
      authorization: authorization,
      headers: headers,
      params: params,
    });
  },
  post: async (url, authorization = '', headers = {}, params = {}) => {
    return await lib.http.request['@1.1.7'].post({
      url: url,
      authorization: authorization,
      headers: headers,
      params: params,
    });
  },
}