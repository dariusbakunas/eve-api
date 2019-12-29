import fetch, { Headers, RequestInit, Response } from 'node-fetch';
import logger from './logger';

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

interface RequestOptions extends RequestInit {
  retries?: number;
}

interface RequestResponse<T> {
  data: T;
  headers: Headers;
}

const request = async <T>(url: string, options?: RequestOptions): Promise<RequestResponse<T>> => {
  const timerStart = process.hrtime();
  const requestMethod = options && options.method ? options.method : 'GET';
  let retry = options && options.retries ? options.retries : 1;
  let timerEnd;
  let response;
  let success = false;

  while (retry-- && !success) {
    let error;

    try {
      response = await fetch(url, options);
      response = checkStatus(response);
      success = true;
    } catch (e) {
      error = e;
      if (retry === 0) {
        throw e;
      }
    } finally {
      timerEnd = process.hrtime(timerStart);

      const time = (timerEnd[1] / 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 });

      if (error) {
        logger.error(`${requestMethod} ${url}, failed: ${error} ${time}ms`);
      } else {
        logger.info(`${requestMethod} ${url} ${time}ms`);
      }
    }
  }

  if (response) {
    const data = await parseJSON(response);
    return {
      headers: response.headers,
      data,
    };
  } else {
    throw new Error(`Empty fetch response: ${url}`);
  }
};

export default request;
