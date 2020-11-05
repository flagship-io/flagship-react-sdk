var React = require("react");

class DefaultLayout extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossOrigin="anonymous"
          />
        </head>
        <body>
          {this.props.children}

          <script
            src="https://unpkg.com/react@16/umd/react.development.js"
            crossOrigin="true"
          ></script>
          <script
            src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
            crossOrigin="true"
          ></script>
          <script src="/scripts/react-bootstrap.js" />
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;
