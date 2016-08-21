import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';

import Header from './Header';
import DataGrid from './DataGrid';
import SearchBox from './SearchBox';
import ComboBox from './ComboBox';
import Message from './Message';
import GridOptions from './GridOptions';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = AppStore.getState();
    if (props.location.query.user) {
      AppActions.setQuery(props.location.query.user);
    }
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    let query = newProps.location.query;
    if (query) {
      if (query.user) {
        AppActions.setQuery(query.user);
      }
      if (query.page) {
        AppActions.setCurrentPage(parseInt(query.page));
      }
    }
  }

  componentDidMount() {
    AppStore.listen(this.onStoreChange);
  }

  componentWillUnmount() {
    AppStore.unlisten(this.onStoreChange);
  }

  onStoreChange(state) {
    console.log('trace: onStoreChange: ', state);
    this.setState(state);
  }

  onSearchBoxChange(key, value) {
    return AppActions.setQuery(value);
  }

  render() {
    return (
      <div>
        <Header />
        <Grid>
          <Row>
            <SearchBox label={'Search...'} onChange={this.onSearchBoxChange}/>
          </Row>
          <Row>
            <Col md={9} sm={8} style={{marginTop: '5px'}}>
              <GridOptions filters={this.state.filters}
                           sorters={this.state.sort}/>
            </Col>
            <Col md={1}>
              <ComboBox action={AppActions.setSort}
                        value={this.state.sort}
                        source={this.state.allColumns}
                        icon={'sort'}
                        dialogTitle={'Sort by selected fields'}/>
            </Col>
            <Col md={1}>
              <ComboBox source={this.state.allFilters}
                        value={this.state.filters}
                        action={AppActions.setFilters}
                        icon={'filter_list'}
                        dialogTitle={'Filter data'}/>
            </Col>
            <Col md={1}>
              <ComboBox action={AppActions.setColumns}
                        value={this.state.columns}
                        source={this.state.allColumns}
                        icon={'view_headline'}
                        dialogTitle={'Display selected columns'}/>
            </Col>
          </Row>
          <DataGrid source={this.state.pagedItems}
                    all={this.state.filteredItems}
                    model={this.state.userModel}
                    size={this.state.size}
                    currentPage={this.state.currentPage}
                    lastPage={this.state.lastPage}
                    pages={this.state.pages}/>
          <Message/>
        </Grid>
      </div>
    )
  }
}

export default App;