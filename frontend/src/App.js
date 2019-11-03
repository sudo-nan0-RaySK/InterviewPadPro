import React from 'react';
import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav';
import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: `
			class Sol{
        		public static void main(String args[]){
          		System.out.println();
        	}
      }`
		}
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
				</div>
			</div>
		);
	}
}
