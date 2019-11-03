import React from "react";
export class Question extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="base-container" ref={this.props.containerRef}>
          <div className="header">Add Question</div>
          <div className="content">
            <div className="form">
              <div className="form-group">
                <label htmlFor="Title">Title</label>
                <input type="text" name="Title" placeholder="Title" />
              </div>
              <div className="form-group">
                <label htmlFor="Time">Time Limit (s)</label>
                <input type="number" name="Time" placeholder="Time" />
              </div>
              <div className="form-group">
                <label htmlFor="Tags">Tags</label>
                <input type="text" name="Tags" />
              </div>
              <div className="form-group">
                <label htmlFor="TestCases">Test Cases (number)</label>
                <input type="number" name="TestCases" />
              </div>
              <div className="form-group">
              <label htmlFor="questionfile">Upload File</label>
            <input type="file" name="fileToUpload" id="fileToUpload"/>
              </div>
              <div className="form-group">
            <button type="button" className="btn">
            Add Question
          </button>
            </div>
            </div>
          </div>
        </div>
      );
    }
  }