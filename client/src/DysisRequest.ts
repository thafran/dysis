export class DysisRequest {
  
  static DEBUG: boolean = true;

  static API_URL: string = 'https://dysis-server.herokuapp.com/';
  static API_URL_DEV: string = 'http://localhost:8080/';

  static async get(
      path: string, 
  ): Promise<any> {
    const BASE_URL = this.DEBUG ? this.API_URL_DEV : this.API_URL;
    try {
      const response = await fetch(
        BASE_URL + path,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        }
      );
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.toString())
      }
    } catch (error) {
      throw Error(error)
    }
  }

  static async post(
      path: string,
      data: Object,
  ): Promise<any> {
    const BASE_URL = this.DEBUG ? this.API_URL_DEV : this.API_URL;
    try {
      const response = await fetch(
        BASE_URL + path,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'},
        }
      );
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.toString())
      }
    } catch (error) {
      console.log(error)
    }
  }
}
