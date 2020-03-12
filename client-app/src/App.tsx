import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Header, Icon, List, Container } from 'semantic-ui-react';

class App extends Component {
  state = {
    values: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/values')
      .then((response) => {
        this.setState({
          values: response.data
        })
      })
  }

  render() {
    return (
      <Container>

        <Header as='h2'>
          <Icon name='plug' />
          <Header.Content>Reactivities</Header.Content>
        </Header>

        <List ordered>
          {this.state.values.map((value: any) => (
            <List.Item as='a' key={value.id}>{value.name}</List.Item>
          ))}
        </List>

      </Container>
    );
  }
}

export default App;
