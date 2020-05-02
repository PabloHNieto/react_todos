import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import './Navbar.css';

class Navbar extends Component {
  constructor(props){
    super(props);
    this.showGroupOptions = [{value:-1, label: "all"}, 
                             {value: 0, label: "archived"}, 
                             {value: 1, label: "active"}];
    this.showTaskOptions = [{value:-1, label: "all"}, 
                             {value: 0, label: "completed"}, 
                             {value: 1, label: "pending"}];
    this.state = {searchContent:'',
                  showGroup: this.showGroupOptions[0],
                  showTask: this.showTaskOptions[2]
                }
    this.options = ['one', 'two', 'three'];
  }

  componentDidMount(){
    this.props.onChangeSearchParameters(this.state);
  }

  componentDidUpdate(_, prevState){
    if (JSON.stringify(this.state) !== JSON.stringify(prevState)){
      this.props.onChangeSearchParameters(this.state);
    }
  }

  handleChange = (e) => {
    const newValue = e.target.value;
    this.setState({searchContent: newValue});
  }
  
  showGroupOptionsChange = (value)=>{
    this.setState({showGroup: value});
  }

  showTaskOptionsChange = (value)=>{
    this.setState({showTask: value});
  }

  render() {
    return (
      <div className="navbar">
        <input className="searchContent"
          onChange={this.handleChange}
          placeholder="Search content"
        /> 
        <label>Show Groups
          <Dropdown className='dropdown'
            controlClassName='dropdownControl'
            menuClassName='dropdownMenu'
            options={this.showGroupOptions} 
            value={this.state.showGroup.label}
            onChange={this.showGroupOptionsChange}
            placeholder="Show Groups"/>
        </label>
        <label>Show Tasks
          <Dropdown className='dropdown'
            controlClassName='dropdownControl'
            menuClassName='dropdownMenu'
            options={this.showTaskOptions} 
            value={this.state.showTask.label}
            onChange={this.showTaskOptionsChange}
            placeholder="Show Groups"/>
        </label>
      </div>
    )
  }
}


export default Navbar;