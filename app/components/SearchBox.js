import React from 'react';
import Input from 'react-toolbox/lib/input';

class SearchBox extends React.Component {
  render() {
    return(
      <Input type='text' label={this.props.label} onChange={this.props.onChange.bind(this, 'search')} name='search' maxLength={16} />
    );
  }
}

export default SearchBox;