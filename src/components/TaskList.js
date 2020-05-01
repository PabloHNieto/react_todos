import React, { Component } from 'react';
import {GroupItem } from './GroupItem';
import {dummy_data, gen_dummy_group} from '../utils/dummy_data';

class TaskList extends Component {
  
  constructor(props){
    super(props);
    this.state = {"loading":true, tmpData: gen_dummy_group(), group:null};
    this.addNewTaskGroup = this.addNewTaskGroup.bind(this);
    this.storeData = this.storeData.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.storeTmpData = this.storeTmpData.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
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

  storeTmpData = (data) => {
    this.setState({tmpData: data});
  }

  storeData = (data, taskType) => {
    let newGroup;

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

    const stringNewState = JSON.stringify({group: newGroup});
    localStorage.setItem(this.storeLocation, stringNewState);

    this.setState({tmpData:gen_dummy_group(), group: newGroup})
  }

  onSortEnd = (oldIndex, newIndex) => {

    if (oldIndex === newIndex) return null

    let newGroup2 = this.state.group.slice()
      .filter((e) => e.status > 0);

    let newGroup = newGroup2.slice();
    newGroup.splice(oldIndex, 1)
    newGroup.splice(newIndex, 0, newGroup2[oldIndex])
    this.setState({group: newGroup})
  }

  onFocus() {
    clearTimeout(this.timeOutId);
  }

  render() {
    return (
      <div className="container">
        {this.state.loading && <div>Loading</div>} 
        {!this.state.loading && 
          this.state.group.filter((e) => e.status > 0)
          .map((e, idx)=>(
            <GroupItem 
              onDrop={this.onSortEnd}
              index={idx}
              key={e._id} 
              sortBy="createdAt"
              showChecked={true}
              storeData={this.storeData}
              group={e}/>
          ))
        }
        <GroupItem key="newTask"
          onBlur={this.addNewTaskGroup} 
          onFocus={this.onFocus}
          showChecked={false}
          sortBy="createdAt"
          storeData={this.storeTmpData}
          group={this.state.tmpData}/>
      </div>
    );
  }
}

export default TaskList;