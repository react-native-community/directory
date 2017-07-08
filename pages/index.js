import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';

import { initStore } from '../common/store';
import { isEmptyOrNull } from '../common/strings';
import { handleFilterLibraries } from '../common/search';
import { isMobileBrowser } from '../common/window';

import Document from '../components/Document';
import GlobalTooltip from '../components/GlobalTooltip';
import GlobalModal from '../components/GlobalModal';
import PageLayout from '../components/PageLayout';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LibraryList from '../components/LibraryList';

class Index extends React.PureComponent {
  static async getInitialProps({ req }) {
    return req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent };
  }

  static propTypes = {
    libraries: PropTypes.array,
    search: PropTypes.string,
    sortBy: PropTypes.string,
    topic: PropTypes.string,
    topics: PropTypes.object,
    userAgent: PropTypes.string,
  };

  render() {
    const isMobile = isMobileBrowser(this.props.userAgent);

    const needsFilter =
      !isEmptyOrNull(this.props.topic) || !isEmptyOrNull(this.props.search);

    const libraries = needsFilter
      ? handleFilterLibraries(this.props)
      : this.props.libraries;

    return (
      <Document>
        <Header count={this.props.libraries.length} />
        <Navigation selected={this.props.sortBy} />
        <PageLayout>
          <LibraryList
            isMobile={isMobile}
            topics={this.props.topics}
            libraries={libraries}
          />
        </PageLayout>
        {isMobile ? <GlobalModal /> : <GlobalTooltip />}
        <Footer />
      </Document>
    );
  }
}

export default withRedux(initStore, state => {
  return {
    sortBy: state.sortBy,
    libraries: state.libraries,
    topic: state.topic,
    topics: state.topics,
    search: state.search,
  };
})(Index);
