import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Header from './Header';
import DataGrid from './DataGrid';
import SearchBox from './SearchBox';
import ComboBox from './ComboBox';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = AppStore.getState();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    let query = newProps.location.query;
    if (query && query.page) {
      AppActions.setCurrentPage(parseInt(query.page));
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
            <Col md={12}>
              <SearchBox label={'Filter...'} onChange={this.onSearchBoxChange}/>
            </Col>
          </Row>
          <Row>
            <Col md style={{marginTop: '20px'}}>
              <ComboBox source={this.state.allFilters}
                        value={this.state.filters}
                        action={AppActions.setFilters}
                        dialogLabel={'Choose types to filter'}
                        dialogTitle={'Filter data'}/>
            </Col>
            <Col md style={{marginTop: '20px'}}>
              <ComboBox action={AppActions.setColumns}
                        value={this.state.columns}
                        source={this.state.allColumns}
                        dialogLabel={'Choose columns to display'}
                        dialogTitle={'Display selected columns'}/>
            </Col>
          </Row>
          <DataGrid source={this.state.pagedItems} 
                    model={this.state.userModel}
                    size={this.state.size}
                    currentPage={this.state.currentPage}
                    pages={this.state.pages}/>
        </Grid>
      </div>
    )
  }
}

export default App;