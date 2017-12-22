import * as React from "react";
import { Service } from "../service";

export class Markdown extends React.Component<{
  src: string
}, {
  html: string
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      html: "Loading ..."
    };
  }
  componentDidMount() {
    Service.compileMarkdownToHtml(this.props.src).then((html) => {
      this.setState({html});
    });
  }
  render() {
    return <div className="hack" dangerouslySetInnerHTML={{__html: this.state.html}}/>;
  }
}