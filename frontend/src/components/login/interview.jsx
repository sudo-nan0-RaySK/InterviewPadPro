import React from "react";
export class Interview extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="base-container" ref={this.props.containerRef}>
          <div className="header">Add Interview</div>
          <div className="content">
            <div className="form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" name="fname" placeholder="name" />
              </div>
              <div className="form-group">
                <label htmlFor="Interviewer">Interviewer</label>
                <input type="text" name="Interviewer" placeholder="Interviewer" />
              </div>
              <div className="form-group">
                <label htmlFor="Candidate">Candidate</label>
                <input type="text" name="Candidate" />
              </div>
              <div className="form-group">
                <label htmlFor="Description">Description</label>
                <input type="text" name="Description" />
              </div>
              <div className="form-group">
                <label htmlFor="link">Link</label>
                <input type="url" name="link" placeholder="link" />
              </div>
            </div>
          </div>
          <div className="footer">
            <button type="button" className="btn">
              Login
            </button>
          </div>
        </div>
      );
    }
  }