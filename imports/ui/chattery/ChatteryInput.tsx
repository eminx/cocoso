import React from 'react';
// import PropTypes from 'prop-types';
import i18n from 'i18next';

interface ChatteryInputProps {
  onNewMessage: (message: string) => void;
}

interface ChatteryInputState {
  inputValue: string;
}

class ChatteryInput extends React.Component<ChatteryInputProps, ChatteryInputState> {
  state: ChatteryInputState = {
    inputValue: '',
  };

  onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { inputValue } = this.state;
    if (inputValue !== '') {
      this.setState(
        {
          inputValue: '',
        },
        () => this.props.onNewMessage(inputValue)
      );
    }
  };

  render() {
    return (
      <div className="chattery-inputform-container">
        <form className="chattery-inputform" autoComplete="off" onSubmit={this.onSubmit}>
          <textarea
            className="chattery-input"
            value={this.state.inputValue}
            onChange={this.onChange}
          />

          <input
            type="submit"
            className="chattery-submitbutton"
            value={i18n.t('common:actions.send')}
          />
        </form>
      </div>
    );
  }
}

export default ChatteryInput;
