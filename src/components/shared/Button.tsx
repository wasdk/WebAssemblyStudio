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

import * as React from "react";

export function Button(props: {
  icon: JSX.Element;
  label?: string;
  title?: string;
  isDisabled?: boolean;
  onClick?: Function;
  customClassName?: string;
  href?: string,
  target?: string,
  rel?: string
}) {
  let className = "button ";
  if (props.customClassName) {
    className += props.customClassName;
  }
  if (props.isDisabled) {
    className += " disabled";
  }
  if (props.href && !props.isDisabled) {
    return (
      <a
        href={props.href}
        target={props.target || ""}
        rel={props.rel || ""}
        className={className}
        title={props.title}
      >
        {props.icon} {props.label}
      </a>
    );
  }
  return <div
    className={className}
    onClick={() => {
      if (props.onClick && !props.isDisabled) {
        props.onClick();
      }
    }}
    title={props.title}
  >
    {props.icon} {props.label}
  </div>;
}