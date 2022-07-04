export class DysisRequest {
  
  static DEBUG: boolean = false;

  static API_URL: string = 'https://dysis-server.herokuapp.com/api/';
  static API_URL_DEV: string = 'http://localhost:8080/api/';

  static async get(
      path: string, 
  ): Promise<any> {
    const BASE_URL = this.DEBUG ? this.API_URL_DEV : this.API_URL;
    try {
      const response = await fetch(
        BASE_URL + path,
        {
          method: 'get',
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
      body: any = null,
  ): Promise<any> {
    const BASE_URL = this.DEBUG ? this.API_URL_DEV : this.API_URL;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin','https://www.reddit.com');
    try {
      const response = await fetch(
        BASE_URL + path,
        {
          method: 'post',
          headers,
          body: body,
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
}
