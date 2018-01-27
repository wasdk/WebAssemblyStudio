import * as React from "react";
import { Service } from "../service";

export interface MarkdownProps {
  src: string
}

export class Markdown extends React.Component<MarkdownProps, {
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
  componentWillReceiveProps(props: MarkdownProps) {
    if (this.props.src !== props.src) {
      Service.compileMarkdownToHtml(props.src).then((html) => {
        this.setState({html});
      });
    }
  }
  render() {
    return <div style={{padding: "8px"}} className="md" dangerouslySetInnerHTML={{__html: this.state.html}}/>;
  }
}