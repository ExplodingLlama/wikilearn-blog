import React from 'react';
import { BrowserRouter, StaticRouter, Route} from "react-router-dom";
import './App.css';
import axios from 'axios'
import moment from 'moment'

axios.defaults.baseURL = "https://us-central1-wikiblog-95cf6.cloudfunctions.net"
let axiosConfig = {
  headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
  }
};

const BlogWrapper = ({ match }) => {
  return <Blog blogId={match.params.blogId} />;
};

const Router = props => {
  if (typeof window !== "undefined") {
    return <BrowserRouter>{props.children}</BrowserRouter>;
  } else {
    return (
      <StaticRouter location={props.path} context={{}}>
        {props.children}
      </StaticRouter>
    );
  }
};

class App extends React.Component {
  render() {
    return (
      <Router path={this.props.path}>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/write" component={CreatePost} />
          <Route path="/post/:blogId" component={BlogWrapper} />

        </div>
      </Router>
    );
  }
}

class Home extends React.Component {
  state = {
    posts: []
  }
  componentDidMount() {
    axios.get(`getAllPosts`).then(res => this.setState({ posts: res.data}))
  }
  render() {
    return (
      <div>
       <h1  style={{width: '90%', padding: '20px'}}>Wikilearn Blog</h1>
       {this.state.posts.map(post => <Post post={post}/>)}
      </div>
    )
  }
}

const Post = props => {
  if(!props.post) return (<div/>);
  return(
    <div>

      <h2  style={{padding: '20px'}}>{props.post.title}</h2>
      {props.post.date && <div style={{paddingLeft: '20px', fontSize: '12px'}}>{moment(props.post.date._seconds*1000).format('Do MMM YYYY')}</div>}
      <div style={{width: '90%', padding: '20px'}}>{props.post.body}</div>
  </div>
  )
}

class Blog extends React.Component {
  state = {
    post: {
    }
  }
  componentDidMount() {
    let url = this.props.blogId ? `getPost/${this.props.blogId}` : `getPost`;
    axios.get(url).then(res => {
      this.setState({ post: res.data});
    })
  }
  render() {
    return (
      <div>
        <h1  style={{padding: '20px'}}>Wikilearn Blog</h1>
        <h2  style={{padding: '20px'}}>{this.state.post.title}</h2>
        {this.state.post.date && <div style={{paddingLeft: '20px', fontSize: '12px'}}>{moment(this.state.post.date._seconds*1000).format('Do MMM YYYY')}</div>}
        <div style={{padding: '20px'}}>{this.state.post.body}</div>
    </div>)
  }
}

class CreatePost extends React.Component {
  state = {
    title: "",
    body: "",
    secretToken: "",
    id: ""
  }

  handleSubmit = () => {
    axios.post(`createPost`, {
      title: this.state.title,
      body: this.state.body,
      secretToken: this.state.secretToken,
      id: this.state.id
    }, axiosConfig)
    .then(res => console.log("response", res))
    .catch(err => console.log(err)
    )
    // axios.get(`getAllPosts`).then(res => console.log("responsebachhhe", res))
  }

  render() {
    return (
      <div>
        <h1  style={{padding: '20px'}}>Write a post</h1>
            Title:
            <input type="text" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
            <br/>
            Body:
            <textarea type="text" value={this.state.body} onChange={e => this.setState({ body: e.target.value })} />
            <br/>
            Token:
            <input type="text" value={this.state.secretToken} onChange={e => this.setState({ secretToken: e.target.value })} />
            <br/>
            Id:
            <input type="text" value={this.state.id} onChange={e => this.setState({ id: e.target.value })} />
            <br/>
            <input type="submit" value="Submit" onClick={this.handleSubmit}/>
      </div>
    )
  }
}

export default App;
