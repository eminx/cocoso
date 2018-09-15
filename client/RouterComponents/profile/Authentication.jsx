import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { AccountsReactComponent } from 'meteor/meteoreact:accounts';

class Authentication extends Component {
  render() {
    const arState = this.arState();

    return (
      <Switch>
        <Route exact path="/sign-in" component={arState} />
        <Route exact path="/sign-up" component={arState} />
        <Route exact path="/forgot-password" component={arState} />
        <Route exact path="/change-password" component={arState} />
        <Route exact path="/reset-password/:token" component={arState} />
      </Switch>
    );
  }

  arState = ({ match, history }) => {
    console.log(match, history);
    const { theme } = this.props;
    const { path, params } = match;

    if (Meteor.userId() && path !== '/change-password') {
      return <Redirect to="/" />;
    }

    return (
      <div id="accounts-wrapper" className={theme}>
        <AccountsReactComponent
          key={theme}
          route={path}
          history={history}
          token={params.token}
        />
      </div>
    );
  };
}

export default Authentication;
