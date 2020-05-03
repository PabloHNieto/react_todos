import React, { Component } from 'react';
import {GroupItem } from './GroupItem';
import Navbar from './Navbar';
import {dummy_data, gen_dummy_group} from '../utils/dummy_data';

class TaskList extends Component {
  
  constructor(props){
    super(props);
    this.state = {"loading":true, 
      tmpData: gen_dummy_group(),
      group:null};
  
    this.storage = {dev: "envWorkingHardOnTodos",
                    prod: "workingHardOnTodos"}
    this.storeType = process.env.REACT_APP_STAGE;
    this.storeLocation = this.storage[this.storeType];
  }
  
  addNewTaskGroup = () => {
    this.timeOutId = setTimeout(() => {
      this.storeData(this.state.tmpData, "newGroup");
    });
  }

  componentDidMount(){
    const storedData = localStorage.getItem(this.storeLocation);

    if (storedData === null){
      this.setState({...dummy_data, "loading":false});
    } else {
      this.setState({...JSON.parse(storedData), "loading":false});
    }
  }

  componentDidUpdate(){
    const newData = {groupFilters:this.state.groupFilters, group: this.state.group};
    const stringNewState = JSON.stringify({...newData});

    localStorage.setItem(this.storeLocation, stringNewState);
  }

  storeTmpData = (data) => {
    this.setState({tmpData: data});
  }

  storeData = (data, taskType) => {
    let newGroup, newData;

    if (taskType === "newGroup"){
      newGroup = [...this.state.group, data];
    } else {
      newGroup = this.state.group.map((g) => {
        if (g._id === data._id) {return data}
        return g
      });
    }

    newGroup = newGroup.filter((group) =>{
      return group.title.toLowerCase() !== "placeholder" && group.title !== null && group.title !== "";
    })

    newData = {groupFilters:this.state.groupFilters, group: newGroup};
    this.setState({tmpData:gen_dummy_group(), ...newData});
  }

  onSortEnd = (oldIndex, newIndex) => {
    if (oldIndex === newIndex) return null

    let newGroup2 = this.state.group.slice()
      .filter((e) => e.status > 0);

    let newGroup = newGroup2.slice();
    newGroup.splice(oldIndex, 1)
    newGroup.splice(newIndex, 0, newGroup2[oldIndex])
    this.setState({group: newGroup});
  }

  onFocus = () => {
    clearTimeout(this.timeOutId);
  }

  updateShowingGroups = (newFilters) =>{
    this.setState({groupFilters: newFilters});
  }

  filterGroups = (group) => {
    let {searchContent, showGroup} = this.state.groupFilters;
    let containsText;
    let strGroup = [group.title].concat(group.tasks.map((e)=>e.name))
    strGroup = JSON.stringify(strGroup).toLowerCase();
    if (this.state.groupFilters.searchContent !== ""){
      containsText = strGroup.includes(searchContent.toLowerCase())
    } else {
      containsText = true;
    }

    let matchStatus;
    
    if (showGroup.value === -1) matchStatus = true;
    else matchStatus = group.status === showGroup.value; 
    return containsText && matchStatus;
  }

  filterTask = (task, {value}) => {
    if (value === -1) return true
    if (value === 0) return task.completed === !value
    else if (value === 1 && !task.completed) return true
    else { //Returning recently completed tasks when filtering for Peding
      let deltaCompleted = Math.floor((Date.now() - task.completedAt)/(1000*3600*24));
      return deltaCompleted === 0;
    }
  }

  sortTask = (task, nextTask, field, sortType) => {
    if (sortType === "asc") return nextTask[field] - task[field]
    return task[field] - nextTask[field]  
  }

  render() {
    return (
      <div>
        <Navbar
          storeLocation={this.storeLocation}
          onChangeSearchParameters={this.updateShowingGroups}
        />
        <div className="container">
          {this.state.loading && <div>Loading</div>} 
          {!this.state.loading && 
          this.state.group
            .filter(e => this.filterGroups(e))
            .map((e, idx)=>(
            <GroupItem 
              onDrop={this.onSortEnd}
              index={idx}
              key={e._id} 
              sortBy="createdAt"
              sort={this.sortTask}
              filter={this.filterTask}
              filterTask={this.state.groupFilters}
              showChecked={e.status}
              storeData={this.storeData}
              group={e}/>
        ))}
          <GroupItem key="newTask"
            onBlur={this.addNewTaskGroup} 
            onFocus={this.onFocus}
            showChecked={false}
            sortBy="createdAt"
            storeData={this.storeTmpData}
            group={this.state.tmpData}/>
        </div>

      </div>
    );
  }
}

export default TaskList;