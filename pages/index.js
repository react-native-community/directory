import React from 'react';
import PropTypes from 'prop-types';

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
import { StyleSheet, css } from 'glamor/aphrodite';
StyleSheet.maxLength = 1000;

import withData from '../components/withData';

class Index extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    libraries: PropTypes.array,
    querySearch: PropTypes.string,
    queryTopic: PropTypes.string,
    sortBy: PropTypes.string,
    userAgent: PropTypes.string,
    rangeStart: PropTypes.number,
    rangeEnd: PropTypes.number,
  };

  _handleSearch = value => {
    return this.props.dispatch({
      type: 'SEARCH_LIBRARY',
      value,
    });
  };

  render() {
    const isMobile = isMobileBrowser(this.props.userAgent);
    const libraries = handleFilterLibraries(this.props);
    const paginatedLibraries = libraries.slice(
      this.props.rangeStart,
      Math.min(this.props.rangeEnd, libraries.length)
    );

    const rightSide = (
      <div className={css(styles.placeholder)}>
        <Queries
          dispatch={this.props.dispatch}
          sortBy={this.props.sortBy}
          queryTopic={this.props.queryTopic}
          querySearch={this.props.querySearch}
        />
        <Topics />
      </div>
    );

    return (
      <Document>
        <Header count={this.props.libraries.length} />
        <Navigation
          onSearch={this._handleSearch}
          querySearch={this.props.querySearch}
          sortBy={this.props.sortBy}
          support={this.props.support}
        />
        <PageLayout rightSide={rightSide}>
          <Pagination
            dispatch={this.props.dispatch}
            isMobile={isMobile}
            libraries={libraries}
            rangeStart={this.props.rangeStart}
            rangeEnd={this.props.rangeEnd}
          />
          <LibraryList isMobile={isMobile} libraries={paginatedLibraries} />
          <Pagination
            dispatch={this.props.dispatch}
            isMobile={isMobile}
            libraries={libraries}
            rangeStart={this.props.rangeStart}
            rangeEnd={this.props.rangeEnd}
          />
        </PageLayout>
        {isMobile ? <GlobalModal /> : <GlobalTooltip />}
        <Footer />
      </Document>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    display: 'block',
  },
});

export default withData(state => {
  return {
    sortBy: state.sortBy,
    libraries: state.libraries,
    queryTopic: state.queryTopic,
    querySearch: state.querySearch,
    rangeStart: state.rangeStart,
    rangeEnd: state.rangeEnd,
    modal: state.modal,
    tooltip: state.tooltip,
    support: state.support,
  };
})(Index);
