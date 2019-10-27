import fetch from 'node-fetch';

export class FetchError extends Error {
  private httpStatusCode: string;
  constructor(message, httpStatusCode) {
    super(message);
    this.name = 'FetchError';
    this.httpStatusCode = httpStatusCode;
  }
}

const checkStatus = res => {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  } else {
    throw new FetchError(res.statusText, res.status);
  }
};

const parseJSON = response => {
  return response.text().then(text => {
    let returnJson = {};
    if (text) {
      try {
        returnJson = JSON.parse(text);
      } catch (e) {
        returnJson = text;
      }
    }
    return returnJson;
  });
};

export default function request(url, options) {
  const httpOptions = options || { method: 'GET' };
  httpOptions.headers = httpOptions.headers || {};
  httpOptions.headers['Content-Type'] = 'application/json';
  httpOptions.credentials = 'same-origin';

  return fetch(url, httpOptions)
    .then(checkStatus)
    .then(parseJSON);
}
