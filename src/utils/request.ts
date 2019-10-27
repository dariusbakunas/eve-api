import fetch, { RequestInit, Response } from 'node-fetch';

export class FetchError extends Error {
  private httpStatusCode: number;
  constructor(message: string, httpStatusCode: number) {
    super(message);
    this.name = 'FetchError';
    this.httpStatusCode = httpStatusCode;
  }
}

const checkStatus = (response: Response) => {
  if (response.ok) {
    // res.status >= 200 && res.status < 300
    return response;
  } else {
    throw new FetchError(response.statusText, response.status);
  }
};

const parseJSON = async (response: Response) => {
  const text = await response.text();

  let returnJson;

  if (text) {
    try {
      returnJson = JSON.parse(text);
    } catch (e) {
      returnJson = text;
    }
  }
  return returnJson;
};

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  let response = await fetch(url, options);
  response = checkStatus(response);
  return parseJSON(response);
};

export default request;
