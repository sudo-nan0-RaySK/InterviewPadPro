import React from 'react';
import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav';
import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor';
import socketIOClient from "socket.io-client";
let socket;
export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: `
			class Sol{
        		public static void main(String args[]){
          		System.out.println();
        		}
			  }`,
			endpoint: "http://localhost:3001/"
		}
		socket = socketIOClient(this.state.endpoint);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(event) {
		this.setState({ value: event.target.value });
	}
	handleSubmit(event) {
		alert('Your favorite flavor is: ' + this.state.value);
		event.preventDefault();
	}
	editorDidMount(editor, monaco) {
		console.log('editorDidMount', editor);
		editor.focus();
		let Peer = require('simple-peer')
		const video = document.querySelector('video')
		const checkboxTheme = document.querySelector('#theme')
		let client = {}
		let currentFilter;
		//get stream
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream => {
				socket.emit('NewClient')
				video.srcObject = stream
				video.play()
				//used to initialize a peer
				function InitPeer(type) {
					let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
					peer.on('stream', function (stream) {
						CreateVideo(stream)
					})
					//This isn't working in chrome; works perfectly in firefox.
					// peer.on('close', function () {
					//     document.getElementById("peerVideo").remove();
					//     peer.destroy()
					// })
					// peer.on('data', function (data) {
					// 	let decodedData = new TextDecoder('utf-8').decode(data)
					// 	let peervideo = document.querySelector('#peerVideo')
					// 	peervideo.style.filter = decodedData
					// })
					return peer
				}
				//for peer of type init
				function MakePeer() {
					client.gotAnswer = false
					let peer = InitPeer('init')
					peer.on('signal', function (data) {
						if (!client.gotAnswer) {
							socket.emit('Offer', data)
						}
					})
					client.peer = peer
				}

				//for peer of type not init
				function FrontAnswer(offer) {
					let peer = InitPeer('notInit')
					peer.on('signal', (data) => {
						socket.emit('Answer', data)
					})
					peer.signal(offer)
					client.peer = peer
				}

				function SignalAnswer(answer) {
					client.gotAnswer = true
					let peer = client.peer
					peer.signal(answer)
				}

				function CreateVideo(stream) {
					CreateDiv()

					let video = document.createElement('video')
					video.id = 'peerVideo'
					video.srcObject = stream
					video.setAttribute('class', 'embed-responsive-item')
					document.querySelector('#peerDiv').appendChild(video)
					video.play()
					//wait for 1 sec
					setTimeout(() => SendFilter(currentFilter), 1000)

					video.addEventListener('click', () => {
						if (video.volume != 0)
							video.volume = 0
						else
							video.volume = 1
					})

				}

				function SessionActive() {
					document.write('Session Active. Please come back later')
				}

				function SendFilter(filter) {
					if (client.peer) {
						client.peer.send(filter)
					}
				}

				function RemovePeer() {
					document.getElementById("peerVideo").remove();
					document.getElementById("muteText").remove();
					if (client.peer) {
						client.peer.destroy()
					}
				}

				function CreateDiv() {
					let div = document.createElement('div')
					div.setAttribute('class', "centered")
					div.id = "muteText"
					div.innerHTML = "Click to Mute/Unmute"
					document.querySelector('#peerDiv').appendChild(div)
					
				}

				socket.on('BackOffer', FrontAnswer)
				socket.on('BackAnswer', SignalAnswer)
				socket.on('SessionActive', SessionActive)
				socket.on('CreatePeer', MakePeer)
				socket.on('Disconnect', RemovePeer)

			})
			.catch(err => document.write(err))
	}
	onChange(newValue, e) {
		console.log('onChange', newValue, e);
	}
	render() {
		let code = this.state.value;
		let lang = "java"
		if (this.state.value === 'c') {
			code = `#include<stdio.h>
						int main()
  							{
    							printf("Hello World");
    							return 0;
  							}`
			lang = "c"
		}
		else if (this.state.value === 'python') {
			code = `# your code goes here`
			lang = "python"
		}
		else if (this.state.value === 'javascript') {
			code = `// your code goes here`
			lang = "javascript"
		}
		else if (this.state.value === 'c++') {
			code = `#include<iostream>
					using namespace std;
					int main()
  					{
    					cout << "Hello World";
   						 return 0;
  					}`
			lang = "cpp"
		}
		const options = {
			selectOnLineNumbers: true
		};
		return (
			<div className="App">
				<div id="editor-pane">
					<Nav />
					<form onSubmit={this.handleSubmit}>
						<label>
							<center>Choose language:
          						<select value={this.state.value} onChange={this.handleChange}>
									<option value="java">Java</option>
									<option value="c">C</option>
									<option value="javascript">Javascript</option>
									<option value="python">Python</option>
									<option value="c++">C++</option>
								</select>
							</center>
						</label>
					</form>
					<div className="IDE-Container">
						<MonacoEditor
							width="90vw"
							height="60vh"
							language={lang}
							theme="vs-dark"
							value={code}
							options={options}
							onChange={this.onChange}
							editorDidMount={this.editorDidMount}
						/>
					</div>
					<div className="container-fluid">
						<div className="row h-10 w-10">
							<div className="col-6 col-sm-3 d-flex justify-content-center">WebRTC View</div>
						</div>
						<div className="row h-50 w-50">
							<div className="col-6 col-sm-3 d-flex justify-content-center">
								<div className="embed-responsive embed-responsive-16by9">
									<video className="embed-responsive-item" muted></video>
								</div>
							</div>
							<div className="col-6 col-sm-3 d-flex justify-content-center">
								<div id="peerDiv" className="embed-responsive embed-responsive-16by9">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
