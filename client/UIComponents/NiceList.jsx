import React, { PureComponent } from 'react';
import { Menu, Icon, List, Dropdown } from 'antd/lib';

const MenuItem = Menu.Item;
const ListItem = List.Item;

class NiceList extends PureComponent {
  render() {
    const { list, actionsDisabled, children } = this.props;

    return (
      <List
        dataSource={list}
        className="nicelist"
        renderItem={(listItem, index) => (
          <ListItem
            style={{ alignItems: 'start' }}
            actions={
              actionsDisabled
                ? []
                : [
                    <Dropdown
                      trigger={['click']}
                      placement="bottomRight"
                      overlay={
                        <Menu>
                          {listItem.actions.map(action => (
                            <MenuItem key={action.content}>
                              <a
                                onClick={
                                  action.isDisabled ? null : action.handleClick
                                }
                                style={
                                  action.isDisabled
                                    ? {
                                        color: '#ccc',
                                        cursor: 'not-allowed'
                                      }
                                    : null
                                }
                              >
                                {action.content}
                              </a>
                            </MenuItem>
                          ))}
                        </Menu>
                      }
                    >
                      <div>
                        <Icon
                          style={{
                            fontSize: 24,
                            marginTop: 6,
                            transform: 'rotate(90deg)'
                          }}
                          type="ellipsis"
                        />
                      </div>
                    </Dropdown>
                  ]
            }
          >
            {children(listItem)}
          </ListItem>
        )}
      />
    );
  }
}

export default NiceList;
