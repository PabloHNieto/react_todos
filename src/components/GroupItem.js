import React, { Component } from 'react';
import { FaTrash as MoreActions } from 'react-icons/fa';
import { FaEllipsisV as DragIcon } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from "./TodoItem";

class GroupItem extends Component {
  constructor(props){
    super(props);
    this.state = {autofocus:false,
      idx: this.props.index,
      sortBy: this.props.sortBy,
      sortType: "asc",
      group: props.group};
  }

  componentDidUpdate(prevProps, prevState){
    //Only update if there are changes
    if (JSON.stringify(prevState.group) !== JSON.stringify(this.state.group)){
      this.props.storeData(this.state.group)
    }
    if (this.props.group._id !== prevState.group._id){
      this.setState({group: this.props.group});
    }
    if (this.props.index !== this.state.idx){
      this.setState({idx: this.props.index});
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
    const newTitle = e.currentTarget.value;
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
  onDragStart = (e) => {
    console.log("DragStart", this.state.group.title, this.state.idx)
    e.dataTransfer.setData("idx", this.state.idx);
  }

  onDrop = (e) => {
    e.preventDefault();
    this.props.onDrop(parseInt(e.dataTransfer.getData("idx")), this.state.idx)
  }

  render() {
    return (
      <div className="group" 
        draggable
        onDragStart={this.onDragStart} 
        onDrop={this.onDrop}
        onDragOver={e => e.preventDefault()}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}>
        <div className="group-header">
          <DragIcon/>
          <input
            type="text" 
            onDragStart={e => e.preventDefault()}
            onFocus={this.highlightAll}
            onChange={this.onTitleChange} 
            onKeyDown={this.detectIntros}
            value={this.state.group.title}/>
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
// const SortableItem = sortableElement((props) => <><GroupItem {...props}/></>);
// export default GroupItem;
export {GroupItem};