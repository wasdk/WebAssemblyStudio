/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import getConfig from "../config";

export enum ServiceTypes {
  Rustc,
  Cargo,
  Clang,
  Service
}

export interface IServiceRequestTask {
  file: string;
  name: string;
  output: string;
  console: string;
  success: boolean;
}

export interface IServiceRequest {
  success: boolean;
  message?: string;
  tasks?: IServiceRequestTask[];
  output?: string;
  wasmBindgenJs?: string;
}

export async function getServiceURL(to: ServiceTypes): Promise<string> {
  const config = await getConfig();
  switch (to) {
    case ServiceTypes.Rustc:
      return config.rustc;
    case ServiceTypes.Cargo:
      return config.cargo;
    case ServiceTypes.Clang:
      return config.clang;
    case ServiceTypes.Service:
      return config.serviceUrl;
    default:
      throw new Error(`Invalid ServiceType: ${to}`);
  }
}

export async function parseJSONResponse(response: Response): Promise < IServiceRequest > {
  const text = await response.text();
  if (response.status === 200) {
    try {
      return JSON.parse(text);
    } catch (_) { /* fall through for errors */ }
  }
  return {
    success: false,
    message: text.replace(/(^<pre>)|(<\/pre>$)/gi, ""),
  };
}

export async function sendRequestJSON(content: Object, to: ServiceTypes): Promise < IServiceRequest > {
  const url = await getServiceURL(to);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(content),
    headers: new Headers({ "Content-Type": "application/json" })
  });

  return parseJSONResponse(response);
}

export async function sendRequest(content: string, to: ServiceTypes): Promise < IServiceRequest > {
  const url = await getServiceURL(to);
  const response = await fetch(url, {
    method: "POST",
    body: content,
    headers: new Headers({ "Content-Type": "application/x-www-form-urlencoded" })
  });
  return parseJSONResponse(response);
}
