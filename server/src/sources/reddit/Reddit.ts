import axios, { AxiosResponse } from 'axios';

export default class Reddit {
  private static BASE_REDDIT_URL: string = 'https://www.reddit.com/';

  static async getPosts(identifier: string): Promise<any> {
    const response: AxiosResponse<any> = await axios.get(
      `${Reddit.BASE_REDDIT_URL}/user/${identifier}/comments.json`,
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
    if (response.statusText === 'OK') {
      return response.data;
    }
    throw new Error('Failed to load comments data from reddit');
  }
}
