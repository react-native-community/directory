import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';

import { initStore } from '../common/store';
import { isEmptyOrNull } from '../common/strings';
import { handleFilterLibraries } from '../common/search';

import Document from '../components/Document';
import GlobalTooltip from '../components/GlobalTooltip';
import PageLayout from '../components/PageLayout';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LibraryList from '../components/LibraryList';

class Index extends React.PureComponent {
  static propTypes = {
    libraries: PropTypes.array,
    search: PropTypes.string,
    sortBy: PropTypes.string,
    topic: PropTypes.string,
    topics: PropTypes.object,
  };

  render() {
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
          <LibraryList topics={this.props.topics} libraries={libraries} />
        </PageLayout>
        <GlobalTooltip />
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
