/* eslint-disable require-jsdoc */
import axios, { AxiosResponse } from 'axios';

import log from '../../helpers/log.js';
import { PushshiftRedditCommentResponse, PushshiftRedditSubmissionResponse } from './PushshiftInterface.js';

export default class Pushshift {
  static async getCommentsFromRedditUserOnPushshift(username: string) {
    log.info('PUSHSHIFT', `Requesting comments from ${username}`);
    const URL = 'https://api.pushshift.io/reddit/comment/search';
    const response: AxiosResponse<PushshiftRedditCommentResponse> = await axios
      .get(`${URL}?author=${username}&limit=1000`);
    return response;
  }

  static async getSubmissionsFromRedditUserOnPushshift(username: string) {
    log.info('PUSHSHIFT', `Requesting submissions from ${username}`);
    const URL = 'https://api.pushshift.io/reddit/submission/search';
    const response: AxiosResponse<PushshiftRedditSubmissionResponse> = await axios
      .get(`${URL}?author=${username}&limit=1000`);
    return response;
  }
}
