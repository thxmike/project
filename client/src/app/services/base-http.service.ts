import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface HttpOptions {
  headers: {};
}
export class BaseHttpService<T> {

  private _httpOptions: HttpOptions = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  public constructor(private _http: HttpClient) { }

  protected get http(): HttpClient {
    return this._http;
  }

  protected set http(value: HttpClient) {
    this._http = value;
  }

  protected get httpOptions(): HttpOptions {
    return this._httpOptions;
  }

  protected set httpOptions(value: HttpOptions) {
    this._httpOptions = value;
  }

  private addHeaders(headers): void {
    if (headers) {
      headers.forEach((header) => {
        for (const key in header) {
          if (header.hasOwnProperty(key)) {
            this._httpOptions.headers[key] = header[key];
          }
        }
      });
    }
  }

  public getList(uri: string, headers: object[] = null): Observable<T[]> {
    return this.get(uri, headers);
  }

  public getItem(uri: string, headers: object[] = null): Observable<T> {
    return this.get(uri, headers);
  }

  public findItem(uri: string, filter: string, headers: object[] = null): Observable<T> {
    return this.get(`${uri}?${filter}`, headers);
  }

  public postItem(uri, payload, headers: object[] = null) {

    this.addHeaders(headers);

    return this._http.post<T>(uri, payload, this._httpOptions);
  }

  public postFile(uri, file, headers: object[] = null) {
    if (headers) {
      this.addHeaders(headers);
    }
  }


  public patchItem(uri, item: Partial<T>, headers: object[] = null) {
    if (headers) {
      this.addHeaders(headers);
    }
    return this._http.patch<T>(uri, item, this._httpOptions).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  public deleteItem(uri, item: Partial<T>, headers: object[] = null): Observable<T> {
    if (headers) {
      this.addHeaders(headers);
    }
    return this._http.delete<T>(uri, item).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  private get(uri: string, headers = null): Observable<any> {
    if (headers) {
      this.addHeaders(headers);
    }
    return this._http.get<T>(uri, this._httpOptions).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `response was: ${JSON.stringify(error, null, 4)}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.'
    );
  }
}
