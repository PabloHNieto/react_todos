import React, { Component, createRef } from 'react';
import { FaTimes as RemoveIcon } from 'react-icons/fa';

class TodoItem extends Component {
  constructor(props){
    super(props);
    this.state = { showDelete:false, showContextMenu:false, todo: props.todo};
    this.mainRef = createRef();
    this.tmpData = {};
  }

  componentDidUpdate(){
    if (this.props.autofocus === true){
      this.mainRef.current.focus();
      this.tmpData = this.state.todo;
    }
  }

  onChangeInfo = () => {
    const newName = this.state.todo.name.trim();
    if (newName.toLowerCase() !== "placeholder"
    & newName !== ""){
      
      if (this.state.todo._id === "newTask"){
        this.props.onFocusOut({...this.state.todo, name:newName}, "add");
        this.setState((prevState)=>({...prevState, todo:{...prevState.todo, name:"Placeholder"}})); 
        this.highlightAll();
      } else if (newName !== "" && (
        newName.toLowerCase() !== this.tmpData.name.toLowerCase())) {
        this.props.onFocusOut({...this.state.todo, name:newName}, "update")
      }
    }
  }

  onHoverIn = () => {
    this.setState({showDelete: true})
  }

  onHoverOut = () => {
    this.setState({showDelete: false})
  }

  removeTask = (e) => {
    e.stopPropagation();
    this.setState((prevState) =>( 
      {showDelete: false}
    ), () => {
      this.props.onFocusOut(this.state.todo, "remove");
    })
  }

  onCompleted = () => {
    const statusIndex = (this.state.todo.status + 1) % Object.keys(this.props.statusHierarchy).length;
    const statusLabel = this.props.statusHierarchy[statusIndex];
    const completed = statusLabel === "completed";
    const completedAt =  completed ? Date.now() : null;
    this.setState((prevState)=>(
      {...prevState, 
        todo:{...prevState.todo,
          status: statusIndex, 
          completedAt: completedAt,
          completed: completed},
      }), () => {this.props.onFocusOut(this.state.todo, "update") 
      }
    )
  }

  detectIntros = (e) => {
    if (e.keyCode === 13){
      e.preventDefault();
      this.props.changeFocus();

      if (this.state.todo._id==="newTask"){
        this.onChangeInfo();
      }
    }
  }

  highlightAll = ( ) => {
    setTimeout(() => {
      document.execCommand('selectAll', false, null)
    }, 0)
  }
  
  handleUpdate = (e) => {
    const newName = e.currentTarget.value;
    this.setState((prevState)=>(
      {...prevState, 
        todo:{...prevState.todo, name:newName},
      })
    )
  }

  showContextMenu = () => {
    this.setState({showContextMenu: !this.state.showContextMenu});
  }
  
  render() {
    const showDelete = this.state.showDelete && this.state.todo._id !== "newTask";
    return (
      <div className={`todo-item status-${this.state.todo.status}`} 
           onFocus={() => {this.tmpData = this.state.todo}}
           onMouseOver={this.onHoverIn}
           onMouseLeave={this.onHoverOut}
           onMouseEnter={this.onHoverIn}
           onContextMenu={this.showContextMenu}
           >
        {/* Checkbox with the status */}
        { (showDelete && this.props.updatable) &&
          <label className={!this.props.showChecked ? "hide":undefined}>
            <input type="checkbox" 
              defaultChecked={this.state.todo.completed} 
              onChange={this.onCompleted}
              />  
            <span className="check"></span>
            {/* <span className="statLabel">{this.props.statusHierarchy[this.state.todo.status]}</span> */}
          </label>
        }
        <input
          className="todo-content"
          ref={this.mainRef}
          onDragStart={e => e.preventDefault()}
          onKeyDown={this.detectIntros}
          onFocus={this.highlightAll}
          onChange={this.handleUpdate}
          reset={this.props.reset}
          onBlur={this.onChangeInfo}
          value={this.state.todo.name}
          disabled={!this.props.updatable? true: false}
          type="text" />
        { (showDelete 
            && this.props.updatable
            && !this.state.todo.completed ) &&
          <RemoveIcon  
          onClick={this.removeTask}
          className="button-small" />
        }
        {/* Modal for changin status */}
      </div>
    );
  }
}

export default TodoItem;