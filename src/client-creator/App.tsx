import React from 'react';


type AppProps = {};

type AppState = {
  loggedIn: boolean;
  user: Account | null;
  modal: 'login' | 'initializer' | 'report-form' | null;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loggedIn: false,
      user: null,
      modal: null,
    };
  }
  
  render(): React.ReactElement {
    return (
      <div className="App">
yeehaw
      </div>
    );
  }

}

export default App;