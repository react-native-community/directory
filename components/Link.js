import React from 'react';
import Link from 'next/link';

export default class CustomLink extends React.PureComponent {
  render() {
    return (
      <Link href={this.props.href}>
        <a
          className={`${this.props.isStyled ? 'link' : undefined} ${this.props.isDarkStyled ? 'dark-link' : undefined}`}>
          <style jsx>{`
          .link {
            color: rgba(65, 160, 248, 1);
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }

            &:visited {
              color: rgba(65, 160, 248, 1);
            }
          }

          .dark-link {
            color: #000000;
            text-decoration: none;
            transition: all 200ms ease;
            transition-property: opacity, transform;
            cursor: pointer;
            overflow-wrap: break-word;
            word-break: break-word;

            &:hover {
              opacity: 0.5;
            }

            &:active {
              transform: scale(1.2);
            }

            &:visited {
              color: #000000;
            }
          }
        `}</style>{this.props.children}
        </a>
      </Link>
    );
  }
}
