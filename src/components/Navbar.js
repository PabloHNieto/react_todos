import React, { Component } from 'react'

class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {searchContent:''}
    this.handleChange = this.handleChange.bind();
  }

  componentDidUpdate(_, prevState){
    if (this.state.searchContent !== prevState.searchContent){
      this.props.onChangeSearchParameters(this.state);
    }
  }

  handleChange = (e) => {
    const newValue = e.target.value;
    this.setState({searchContent: newValue});
  }

  render() {
    return (
      <div>
        <input className="search-content"
          onChange={this.handleChange}
          placeholder="Search content"
        /> 
      </div>
    )
  }
}


export default Navbar;