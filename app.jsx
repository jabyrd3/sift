import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import request from 'request';
import {promisify} from 'util';
import config from './config.example';
const pRequest = promisify(request);
// Rendering a simple centered box
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      folders: [],
      mail: [],
      error: false,
      selected: 0,
      focused: 'list'
    }
  }
  componentDidMount(){
    const fetch = () => 
      pRequest({
        url: `${config.apiRoot}:${config.apiPort}/status`,
        method: 'GET'
      })
      .then(r => JSON.parse(r.body))
      .then(s => this.setState({mail: s.inbox, folders: s.folders}))
      .then(()=> this.refs.subjects.focus())
      .catch(error => console.log(error) || this.setState({error}));
    const focusMail = () => {
      this.setState({focused: 'mail'});
      this.refs.mailPane.focus();
    };
    const focusList = () => {
      this.setState({focused: 'list'});
      this.refs.subjects.focus();
    }
    fetch();
    screen.key(['C-r'], fetch);
    screen.key(['l'], focusMail);
    screen.key(['h'], focusList);
    screen.key(['enter'], () => {
      if(this.state === 'list'){
        this.setState({
          debug:this.state.mail[this.state.selected].location || 'fuck'
        })
        pRequest({
          url:`${config.apiRoot}:${config.apiPort}/message/${
            encodeURIComponent(this.state.mail[this.state.selected].location)}/Archive`,
          method: 'POST'
        }).then(()=>{
            this.setState({
              mail: this.state.mail
                .filter((m,i)=>i!==this.state.selected)
            });
          })
        .catch(e=>this.setState({debug:e}))
      }
    });
  }
  render() {
    return (
      <element>
      <box
        label={` inbox: ${this.state.mail.length} remain `}
        top="0"
        left="0"
        width="100%"
        height="47%"
        border={{type: 'line'}}
        style={{border: {fg: 'blue'}}}>
          <list
            style={{
              selected: {
                fg: 'black',
                bg: 'white'
              },
              width: "100%",
              height: "100%"
            }}
            ref="subjects"
            onAction={(s, val)=>this.setState({selected: val, debug: val})}
            items={this.state.mail
              .map((m,i)=>`${i} | ${m.subject}`)}
            keys={true}
            mouse={true}
            vi={true} />
      </box>
      <box
        ref="mailPane"
        label=" message "
        top="47%"
        left="0"
        width="100%"
        height="59%"
        border={{type: 'line'}}
        keys={true}
        vi={true}
        alwaysScroll={true}
        scrollable={true}
        mouse={true}
        scrollbar={{
          style: {
            bg: 'white'
          }
        }}
        style={{border: {fg: 'blue'}}}>
          {this.state.mail[this.state.selected] &&
            this.state.mail[this.state.selected].text &&
            `from: ${this.state.mail[this.state.selected].from.text}
            \n${this.state.mail[this.state.selected].text.toString()}`}
       </box>
     </element>);
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'sift-email'
});


// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Rendering the React app using our screen
const component = render(<App />, screen);
