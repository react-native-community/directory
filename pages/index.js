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
import Topics from '../components/Topics';
import Pagination from '../components/Pagination';
import Queries from '../components/Queries';

class Index extends React.PureComponent {
  static async getInitialProps({ req, query, store }) {
    if (query.topic) {
      store.dispatch({ type: 'TOPIC_PICKED', value: query.topic });
    }

    if (query.search) {
      store.dispatch({ type: 'SEARCH_LIBRARY', value: query.search });
    }

    if (query.sortBy) {
      store.dispatch({ type: 'SORT_BY', sortBy: query.sortBy });
    }

    return req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent };
  }

  static propTypes = {
    libraries: PropTypes.array,
    querySearch: PropTypes.string,
    queryTopic: PropTypes.string,
    sortBy: PropTypes.string,
    topics: PropTypes.object,
    topicsList: PropTypes.array,
    userAgent: PropTypes.string,
    rangeStart: PropTypes.number,
    rangeEnd: PropTypes.number,
  };

  render() {
    const isMobile = isMobileBrowser(this.props.userAgent);

    const needsFilter =
      !isEmptyOrNull(this.props.queryTopic) ||
      !isEmptyOrNull(this.props.querySearch);

    const libraries = needsFilter
      ? handleFilterLibraries(this.props)
      : this.props.libraries;

    const paginatedLibraries = libraries.slice(
      this.props.rangeStart,
      Math.min(this.props.rangeEnd, libraries.length)
    );

    const rightSide = (
      <div>
        <Queries
          topic={this.props.queryTopic}
          search={this.props.querySearch}
        />
        <Topics topics={this.props.topics} topicsList={this.props.topicsList} />
      </div>
    );

    return (
      <Document>
        <Header count={this.props.libraries.length} />
        <Navigation selected={this.props.sortBy} />
        <PageLayout rightSide={rightSide}>
          <Pagination isMobile={isMobile} libraries={libraries} />
          <LibraryList
            isMobile={isMobile}
            topics={this.props.topics}
            libraries={paginatedLibraries}
          />
          <Pagination isMobile={isMobile} libraries={libraries} />
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
    topics: state.topics,
    topicsList: state.topicsList,
    queryTopic: state.queryTopic,
    querySearch: state.querySearch,
    rangeStart: state.rangeStart,
    rangeEnd: state.rangeEnd,
  };
})(Index);
