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
  async componentDidMount() {
    const html = await Service.compileMarkdownToHtml(this.props.src);
    this.setState({html});
  }
  async componentWillReceiveProps(props: MarkdownProps) {
    if (this.props.src !== props.src) {
      const html = await Service.compileMarkdownToHtml(props.src);
      this.setState({html});
    }
  }
  render() {
    return <div style={{padding: "8px"}} className="md" dangerouslySetInnerHTML={{__html: this.state.html}}/>;
  }
}