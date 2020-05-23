import React from 'react';
import { List, Box } from 'grommet';

function ListMenu({ list, children, ...otherProps }) {
  if (!list) {
    return null;
  }
  return (
    <List data={list} {...otherProps} pad="none">
      {(item, index) => <Box pad="xsmall">{children(item)}</Box>}
    </List>
  );
}

export default ListMenu;
