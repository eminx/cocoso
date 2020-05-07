import React from 'react';
import { List, Box } from 'grommet';

function ListMenu({ list, children, ...otherProps }) {
  if (!list) {
    return null;
  }
  return (
    <Box pad="small">
      <List data={list} {...otherProps} pad="none">
        {(item, index) => <Box pad="xsmall">{children(item)}</Box>}
      </List>
    </Box>
  );
}

export default ListMenu;
