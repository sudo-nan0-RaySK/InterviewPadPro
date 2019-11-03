import React from "react";
import "./App.scss";
import Nav from './components/Nav';
import { Login, Register, Interview, Question } from "./components/login/index";
import { BrowserRouter, Route,NavLink,Link} from "react-router-dom";
class App extends React.Component {
  render() {
    return(
      <div className="App">
        <Nav/>
				<div id="editor-pane">
        <Question/>
				</div>
			</div>
		);
	}
}
export default App;
