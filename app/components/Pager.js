import React from 'react';
import {Grid, Col, Row} from 'react-flexbox-grid';
import Link from 'react-toolbox/lib/link';

class Pager extends React.Component {
  render() {
    return <nav>
      <Grid>
        <Row>
          <Link style={{margin: '5px', marginLeft: '15px'}} label={'First'} />
          <Link style={{margin: '5px'}} active label={'1'} />
          <Link style={{margin: '5px'}} label={'Last'} />
        </Row>
      </Grid>
    </nav>
  }
}

export default Pager;