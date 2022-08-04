import {dysisConfig} from './DysisConfig';

export class DysisRequest {
  
  static BASE_URL = dysisConfig.server.baseUrl;
  
  static async get(
      path: string, 
  ): Promise<any> {
    try {
      const response = await fetch(
        DysisRequest.BASE_URL + path,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        }
      );
      if (response.ok) {
        return response.json();
      } else {
        console.error('Dysis failed to get from server ...');
      }
    } catch (error) {
      console.error('Dysis failed to get from server ...');
    }
  }

  static async post(
      path: string,
      data: Object,
  ): Promise<any> {
    try {
      const response = await fetch(
        DysisRequest.BASE_URL + path,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'},
        }
      );
      if (response.ok) {
        return response.json();
      } else {
        console.error('Dysis failed to post to server ...');
      }
    } catch (error) {
      console.error('Dysis failed to post to server ...');
    }
  }
}
