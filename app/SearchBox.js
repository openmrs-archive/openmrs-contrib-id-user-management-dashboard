import React from 'react';
import Input from 'react-toolbox/lib/input';

/*
 Later will be added customizations
 */
const SearchBox = () => (
  <Input type='text' label='Search...' name='search' maxLength={16 } />
);

export default SearchBox;