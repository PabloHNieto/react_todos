import React, { Component } from 'react';
import {GroupItem } from './GroupItem';
import Navbar from './Navbar';
import {dummy_data, gen_dummy_group} from '../utils/dummy_data';

class TaskList extends Component {
  
  constructor(props){
    super(props);
    this.state = {"loading":true, 
      metaData:null,
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
      const newData = JSON.parse(storedData);
      newData.metaData = {...newData.metaData, ...dummy_data._metadata};
      this.setState({...newData, "loading":false}, ()=>{console.log(this.state)});
    }
  }

  componentDidUpdate(){
    const newData = {metaData:this.state.metaData, group: this.state.group};
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

    //Modified hered metadata:{...this.state.metaData}, 
    newData = {group: newGroup};
    this.setState({tmpData:gen_dummy_group(), ...newData});
  }

  onSortEnd = (dragID, dropID) => {
    // We move the dragID before the dropID
    if (dragID === dropID) return null
    
    const dragIdx = this.state.group.findIndex( e => e._id === dragID);
    const dropIdx = this.state.group.findIndex( e => e._id === dropID);
    
    let newGroup = this.state.group.slice();
    const newGroup2 = this.state.group.slice();
    newGroup.splice(dragIdx, 1)
    newGroup.splice(dropIdx, 0, newGroup2[dragIdx])
    this.setState({group: newGroup});
  }

  onFocus = () => {
    clearTimeout(this.timeOutId);
  }

  updateShowingGroups = (newFilters) =>{
    const newMetaData = {...this.state.metaData, groupFilters: newFilters};
    this.setState({metaData: newMetaData});
  }

  filterGroups = (group) => {
    let {searchContent, showGroup} = this.state.metaData.groupFilters;
    let containsText;
    let strGroup = [group.title].concat(group.tasks.map((e)=>e.name))
    strGroup = JSON.stringify(strGroup).toLowerCase();
    if (this.state.metaData.groupFilters.searchContent !== ""){
      containsText = strGroup.includes(searchContent.toLowerCase())
    } else {
      containsText = true;
    }

    let matchStatus;
    
    if (showGroup.value === -1) matchStatus = true;
    else matchStatus = group.status === showGroup.value; 
    return containsText && matchStatus;
  }

  filterTask = (task, filters) => {
    // -1 show all, 0 show completed, 1 show pending
    let {searchContent} = this.state.metaData.groupFilters; 
    //Placeholder for future exploration of how to do it
    let containsText = task.name.toLowerCase()
      .includes(searchContent.toLowerCase()) 
    containsText = true;

    if (filters.value === -1 && containsText) return true;
    if (filters.value === task.status && containsText) return true;

    else { //Returning recently completed tasks when filtering for Peding
      let deltaCompleted = Math.floor((Date.now() - task.completedAt)/(1000*3600*24));
      return deltaCompleted === 0 && containsText;
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
            .map((e)=>(
            <GroupItem 
              onDrop={this.onSortEnd}
              key={e._id}
              statusHierarchy={this.state.metaData.taskStatusesCorrespondece} 
              sortBy="createdAt"
              updatable={!(e.status===0)}
              sort={this.sortTask}
              filter={this.filterTask}
              filterTask={this.state.metaData.groupFilters}
              showChecked={e.status}
              storeData={this.storeData}
              group={e}/>
        ))}
          <GroupItem key="newTask"
            onBlur={this.addNewTaskGroup} 
            onFocus={this.onFocus}
            showChecked={false}
            sortBy="createdAt"
            sortable={false}
            updatable={true}
            storeData={this.storeTmpData}
            group={this.state.tmpData}/>
        </div>

      </div>
    );
  }
}

export default TaskList;