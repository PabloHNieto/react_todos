import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { FaSortAmountDown, FaSortAmountUp} from 'react-icons/fa';
import { BsPlusCircle, BsDashCircle } from 'react-icons/bs';
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
    this.sortTaskOptions = ["completedAt", "lastModified", "createdAt"];
    this.state = {showMore: false,
                  searchContent:'',
                  sortType: 'asc',   
                  showGroup: this.showGroupOptions[0],
                  showTask: this.showTaskOptions[0],
                  sortTask: this.sortTaskOptions[2]
                }
    this.options = ['one', 'two', 'three'];
  }

  componentDidMount(){
    let storedData = localStorage.getItem(this.props.storeLocation);
    storedData = JSON.parse(storedData).groupFilters;
    let appliedFilters;

    if (!storedData){
      appliedFilters = {
        searchContent: this.state.searchContent,
        sortType: this.state.sortType,
        showGroup: this.state.showGroup,
        showTask: this.state.showTask,
        sortTask: this.state.sortTask
      } 
    } else {
      appliedFilters = {...storedData};
    }

    this.setState({...appliedFilters}, 
      this.props.onChangeSearchParameters(appliedFilters)
    );
  }

  componentDidUpdate(_, prevState){
    if (JSON.stringify(this.state) !== JSON.stringify(prevState)){
      this.props.onChangeSearchParameters(this.state);
    }
  }

  changeSortType = () => {
    this.setState({sortType: 
      this.state.sortType === "asc"? "desc": "asc"})
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

  sortTaskOptionsChange = ({value})=>{
    this.setState({sortTask: value});
  }

  showMore = () => {
    this.setState({showMore: !this.state.showMore});
  }

  hideMore = () => {
    this.setState({showMore: false});
  }

  render() {
    return (
      <div className="navbar" onMouseLeave={this.hideMore}>
        <div className="searchContainer">
          <input className="searchContent"
            onChange={this.handleChange}
            placeholder="Search content"
          />
        </div>
        { !this.state.showMore?
          <div 
            className="showMoreIcon"
            onClick={this.showMore}>
            <BsPlusCircle />
          </div> 
          :
          <div 
            className="showMoreIcon"
            onClick={this.showMore}>
            <BsDashCircle />
          </div> 
        }
          <div className={`menu ${!this.state.showMore && 'hideMenu'}`}>
            <label>Show Groups
              <Dropdown options={this.showGroupOptions} 
                value={this.state.showGroup.label}
                onChange={this.showGroupOptionsChange}
                placeholder="Show Groups"/>
            </label>
            <label>Show Tasks
              <Dropdown options={this.showTaskOptions}
                value={this.state.showTask.label}
                onChange={this.showTaskOptionsChange}
                placeholder="Show Groups"/>
            </label>
            <label>Sort Tasks
              <Dropdown options={this.sortTaskOptions} 
                value={this.state.sortTask}
                onChange={this.sortTaskOptionsChange}/>
            </label>
            <label className="icon"
              onClick={this.changeSortType}>
            {this.state.sortType === "asc"?
              <FaSortAmountUp/> : <FaSortAmountDown/>  
            }
            </label>
        </div> 
      </div>
    )
  }
}


export default Navbar;