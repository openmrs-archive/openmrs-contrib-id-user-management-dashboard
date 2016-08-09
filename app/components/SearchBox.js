import React from 'react';
import Input from 'react-toolbox/lib/input';
import {IconButton} from 'react-toolbox/lib/button';
import {Grid, Col, Row} from 'react-flexbox-grid';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

class SearchBox extends React.Component {
  onClear () {
    AppActions.setQuery('');
  }
  render() {
    let query = AppStore.getState().query;
    let clear = query && query.length ? <IconButton icon='clear' onClick={this.onClear} style={{marginTop: '25px', marginLeft: '-10px'}}/> : '';
    return(
      <Grid>
        <Row>
          <Col md={11} sm={10}>
            <Input type='text' label={this.props.label} value={AppStore.getState().query} onChange={this.props.onChange.bind(this, 'search')} name='search'/>
          </Col>
          <Col md={1} sm={2}>
            {clear}
          </Col>  
        </Row>
      </Grid>
    );
  }
}

export default SearchBox;