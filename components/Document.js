import Head from 'next/head';
import React from 'react';

export default class Document extends React.Component {
  static defaultProps = {
    title: 'Native Directory',
    description:
      'Native Directory is a curated list of React Native libraries to help you build your projects.',
  };

  render() {
    return (
      <div>
        <style jsx global>{`
          @font-face {
            font-family: 'office-code';
            src: url('static/fonts/OfficeCodePro-Regular.eot');
            src: url('static/fonts/OfficeCodePro-Regular.woff2') format('woff2'),
              url('static/fonts/OfficeCodePro-Regular.woff') format('woff'),
              url('static/fonts/OfficeCodePro-Regular.ttf') format('truetype');
          }

          @font-face {
            font-family: 'office-code-medium';
            src: url('static/fonts/OfficeCodePro-Medium.eot');
            src: url('static/fonts/OfficeCodePro-Medium.woff2') format('woff2'),
              url('static/fonts/OfficeCodePro-Medium.woff') format('woff'),
              url('static/fonts/OfficeCodePro-Medium.ttf') format('truetype');
          }

          html,
          body,
          div,
          span,
          applet,
          object,
          iframe,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          p,
          blockquote,
          pre,
          a,
          abbr,
          acronym,
          address,
          big,
          cite,
          code,
          del,
          dfn,
          em,
          img,
          ins,
          kbd,
          q,
          s,
          samp,
          small,
          strike,
          strong,
          sub,
          sup,
          tt,
          var,
          b,
          u,
          i,
          center,
          dl,
          dt,
          dd,
          ol,
          ul,
          li,
          fieldset,
          form,
          label,
          legend,
          table,
          caption,
          tbody,
          tfoot,
          thead,
          tr,
          th,
          td,
          article,
          aside,
          canvas,
          details,
          embed,
          figure,
          figcaption,
          footer,
          header,
          hgroup,
          menu,
          nav,
          output,
          ruby,
          section,
          summary,
          time,
          mark,
          audio,
          video {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
            box-sizing: border-box;
          }

          article,
          aside,
          details,
          figcaption,
          figure,
          footer,
          header,
          hgroup,
          menu,
          nav,
          section {
            display: block;
          }

          body {
            line-height: 1;
            font-size: 14px;
            color: #000000;
            font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir,
              helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial,
              sans-serif;

            @media (max-width: 768px) {
              font-size: 12px;
            }
          }

          p,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            line-height: 1.5;
          }

          ol,
          ul {
            list-style: none;
          }

          button,
          textarea,
          input {
            resize: none;
            border: 0;
            outline: 0;
            padding: 0;
            margin: 0;

            &:focus {
              border: 0;
              outline: 0;
            }
          }

          blockquote,
          q {
            quotes: none;

            &:before,
            &:after {
              content: '';
              content: none;
            }
          }

          table {
            border-collapse: collapse;
            border-spacing: 0;
          }
        `}</style>
        <Head>
          <title>
            {this.props.title}
          </title>
          <meta name="twitter:title" content={this.props.title} />
          <meta property="og:title" content={this.props.title} />

          <meta name="description" content={this.props.description} />
          <meta property="og:description" content={this.props.description} />
          <meta name="twitter:description" content={this.props.description} />

          <meta name="format-detection" content="telephone=no" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="UTF-8" />
          <meta name="sourceApp" content="mobileWeb" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta property="og:site_name" content="React Native Directory" />
          <meta name="twitter:site" content="@expo_io" />

          <link rel="shortcut icon" href="/static/favicon.png" />

          <link rel="apple-touch-icon-precomposed" content="/static/logo.png" />
          <meta property="og:image" content="/static/logo.png" />
          <meta name="twitter:image" content="/static/logo.png" />
          <meta name="msapplication-TileImage" content="/static/logo.png" />
        </Head>
        {this.props.children}
      </div>
    );
  }
}
