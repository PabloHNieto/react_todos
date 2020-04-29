import React, { Component } from 'react';
import { FaTrash as MoreActions } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import ContentEditable from 'react-contenteditable';
import TodoItem from "./TodoItem";

class GroupItem extends Component {
  constructor(props){
    super(props);
    this.state = {autofocus:false,
      sortBy: this.props.sortBy,
      sortType: "asc",
      group: props.group};
    this.changeFocus = this.changeFocus.bind(this);
    this.onArchive = this.onArchive.bind(this);
    this.onChangeInfo = this.onChangeInfo.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.detectIntros = this.detectIntros.bind(this);
    this.highlightAll = this.highlightAll.bind(this);
  }

  componentDidUpdate(_, prevState){
    //Only update if there are changes
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)){
      this.props.storeData(this.state.group)
    }
    if (this.props.group._id !== prevState.group._id){
      this.setState({group: this.props.group});
    }
  }

  changeFocus = () => {
    this.setState({autofocus: true});
  }

  onArchive = (data) => {
    this.setState((prevState)=>(
      {...prevState, 
        group:{...prevState.group, status:0}
      }) 
    );
  }

  onChangeInfo = (data, taskType) => {
    let tasks;
    let didTasksChanged = false;
    if (taskType === "add"){
      const newTask = {_id:uuidv4(), createdAt: Date.now(), lastModified: Date.now(), 
        name: data.name, status: 1, completed:false};
      tasks = [...this.state.group.tasks, newTask];
      didTasksChanged = true;
    } else if (taskType === "update"){
      console.log("Updating")
      tasks = this.state.group.tasks.map((t) => {
        if (t._id === data._id) {
          return {...data, lastModified: Date.now()}
        }
        else {return t}
      });
      didTasksChanged = true;
    } else if (taskType === "remove"){
      tasks = this.state.group.tasks.filter((t) => {
        return t._id !== data._id;
      })
      didTasksChanged = true;
    }

    if (didTasksChanged === true){
      tasks = tasks.sort((a, b) => {
        return b[this.state.sortBy] - a[this.state.sortBy] 
      })

      if(this.state.sortType === "asc"){tasks.reverse()}
      console.log("settign states")
      this.setState((prevState)=>(
        {autofocus:false, group:{...prevState.group, tasks:tasks}}
      ));
    }
  }

  onTitleChange = (e) => {
    const newTitle = e.currentTarget.textContent.trim();
    if (newTitle.toLowerCase() !== "placeholder" 
      & newTitle !== null  
      & newTitle.toLowerCase() !== this.state.group.title
      & newTitle !== ""){
      this.setState((prevState)=>({...prevState, group:{...prevState.group, title:newTitle}}));
    }
  }

  detectIntros = (e) => {
    if (e.keyCode === 13){
      e.preventDefault();
      this.onTitleChange(e);
      this.changeFocus();
    }
  }

  highlightAll = ( ) => {
    setTimeout(() => {
      document.execCommand('selectAll', false, null)
    }, 0)
  }

  render() {
    return (
      <div className="group" 
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}>
        <div className="group-header">
          <ContentEditable 
            onFocus={this.highlightAll}
            onBlur={this.onTitleChange} 
            onKeyDown={this.detectIntros}
            html={this.state.group.title} 
            tagName="div"/>
          <div className="button-delete" onClick={this.onArchive}>
            <MoreActions />
          </div> 
        </div>
        <div className="group-body">
         {this.state.group.tasks.length >0 &&
            this.state.group.tasks.map((e)=>(
              <TodoItem
              key={e._id}
              changeFocus={this.changeFocus} 
              showChecked={this.props.showChecked} 
              onFocusOut={this.onChangeInfo} 
              todo={e}/>
              ))
            }
          <TodoItem 
            key={"newTask"}
            changeFocus={this.changeFocus}
            autofocus={this.state.autofocus}
            showChecked={false} 
            reset="Placeholder"
            onFocusOut={this.onChangeInfo} 
            todo={{_id: "newTask", name:"Placeholder"}}/>
        </div> 
      </div>
    );
  }
}

export default GroupItem;