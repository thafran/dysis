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
        console.log('Dysis failed to get information from server ...');
      }
    } catch (error) {
      console.log('Dysis failed to get information from server ...');
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
        console.log('Dysis failed to send information to server ...');
      }
    } catch (error) {
      console.log('Dysis failed to send information to server ...');
    }
  }
}
