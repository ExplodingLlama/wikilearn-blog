import React from 'react';
import './App.css';
import axios from 'axios'

function App() {
  return (
    <div>
    <Blog />
    </div>


  );
}

class Blog extends React.Component {
  state = {
    post: {}
  }
  componentDidMount() {
    axios.get('https://us-central1-wikiblog-95cf6.cloudfunctions.net/getPost').then(res => {
      this.setState({ post: res.data});
    })
  }
  render() {
    return (
      <div>
        <h1  style={{padding: '20px'}}>Wikilearn Blog</h1>
        <h2  style={{padding: '20px'}}>{this.state.post.title}</h2>
        <br/>
        <div style={{padding: '20px'}}>{this.state.post.body}</div>
    </div>)
  }
}

export default App;
