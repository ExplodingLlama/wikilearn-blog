import React from 'react';
import { BrowserRouter, StaticRouter, Route} from "react-router-dom";
import './App.css';
import axios from 'axios'
import moment from 'moment'
import Loading from './Loading'

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
        <div  style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
    axios.get(`getAllPosts`).then(res => {
      let data = res.data;
      data.sort((a,b) => b.date._seconds-a.date._seconds);
      this.setState({ posts: res.data})
    })
  }
  render() {
    return (
      <div style={{maxWidth: '60em'}}>
       <h1  style={{width: '90%', padding: '20px'}}>Wikilearn Blog</h1>
       {this.state.posts.length === 0 && <Loading />}
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
    .then(res => {
      console.log("response", res);
      window.location.href = '/'
    })
    .catch(err => console.log(err)
    )
    // axios.get(`getAllPosts`).then(res => console.log("responsebachhhe", res))
  }

  render() {
    return (
      <div>
        <h1>Write a post</h1>
          <div className='row'>
            <div style={{paddingRight:'30px', fontWeight: 'bold'}}>Title</div>
            <input style={{width: '500px', padding: '5px', borderRadius: '5px'}} type="text" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
          </div>
            <div className='row'>
              <div style={{paddingRight:'30px', fontWeight: 'bold'}}>Body</div>
              <textarea style={{width: '500px', padding: '5px', borderRadius: '5px'}} rows='20' type="text" value={this.state.body} onChange={e => this.setState({ body: e.target.value })} />
            </div>
            <div className='row'>
              <div style={{paddingRight:'30px', fontWeight: 'bold'}}>Token</div>
              <input style={{width: '500px', padding: '5px', borderRadius: '5px'}} type="text" value={this.state.secretToken} onChange={e => this.setState({ secretToken: e.target.value })} />
            </div>
            <div className='row'>
              <div style={{paddingRight:'30px', fontWeight: 'bold'}}>Id</div>
              <input style={{width: '500px', padding: '5px', borderRadius: '5px'}} type="text" value={this.state.id} onChange={e => this.setState({ id: e.target.value })} />
            </div>
            <input style={{padding: '6px', marginTop: '20px', borderRadius: '5px', width: '100%'}} type="submit" value="Submit" onClick={this.handleSubmit}/>
      </div>
    )
  }
}

export default App;
