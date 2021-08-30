// Inspired from microsoft/typed-rest-client.
// I had trouble running that version directly in deno so I had
// to write this barebones version myself.

import { Err, Ok, Result } from "./result.ts";

export interface ClientResponse<T> {
  body?: T;
  status: number;
}

interface ErrorMessage {
  status: number;
  message: string;
}

interface FetchOptions {
  headers?: {
    [name: string]: string;
  };
  body?: unknown;
  method?: string;
}

export class Client {
  baseUrl: string;
  _authorization?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  set authorization(value: string) {
    this._authorization = value;
  }

  delete<B, T>(
    path = "",
  ): Promise<Result<ClientResponse<T>, ErrorMessage>> {
    return this.get(path, {
      method: "delete",
    });
  }

  patch<B, T>(
    body: B,
    path = "",
  ): Promise<Result<ClientResponse<T>, ErrorMessage>> {
    return this.get(path, {
      method: "PATCH",
      body,
    });
  }

  post<B, T>(
    body: B,
    path = "",
  ): Promise<Result<ClientResponse<T>, ErrorMessage>> {
    return this.get(path, {
      method: "POST",
      body,
    });
  }

  async get<T>(
    path?: string,
    options: FetchOptions = {},
  ): Promise<Result<ClientResponse<T>, ErrorMessage>> {
    try {
      const headers: Record<string, string> = {
        ...options.headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
      if (this._authorization) {
        headers["Authorization"] = this._authorization;
      }
      const params: Record<string, unknown> = {
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      };
      if (options.body) {
        params.method = options.method ?? "POST";
        params.body = typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body);
      }
      const res = await fetch(this.baseUrl + path, params);
      if (res.status >= 200 && res.status < 400) {
        const body = await res.json();
        return Ok({
          status: res.status,
          body,
        });
      } else {
        return Err({
          status: res.status,
          message: "Bad response status code.",
        });
      }
    } catch (e) {
      return Err({
        status: e.statusCode ?? 500,
        message: e.message,
      });
    }
  }
}
