import { v4 as uuidv4 } from 'uuid';

const dummy_data = {
  _metadata:{
    statusCorresponde:{
      0:"archive", 
      1:"completed",
      2:"pending"
    },
    taskStatusesCorrespondece:{
      0:"pending", 
      1:"active",
      2:"completed"
    }
  },
  group:[
    {
      _id: uuidv4(),
      title: "BigTask1",
      createdAt: Date.now(),
      status: 1,
      tasks: [
        {
          _id: uuidv4(),
          createdAt: Date.now(),
          name: "First Thing",
          completed: false,
          lastModified: Date.now(),
          status: 0,
        },
        {
          _id: uuidv4(),
          createdAt: Date.now(),
          lastModified: Date.now(),
          name: "Second Thing",
          status: 0,
          completed: false
        },
        {
          _id: uuidv4(),
          createdAt: Date.now(),
          lastModified: Date.now(),
          name: "Thrid Thing",
          status: 1,
          completed: true
        },
      ]
    },{
      _id: uuidv4(),
      title: "BigTask fsasdf asdf adsf asdfa 2",
      createdAt: Date.now(),
      status: "pending",
      tasks: [
        {
          _id: uuidv4(),
          createdAt: Date.now(),
          lastModified: Date.now(),
          name: "First Thing",
          status: 2,
          completed: false
        },
        {
          _id: uuidv4(),
          createdAt: Date.now(),
          lastModified: Date.now(),
          name: "Second Thing",
          status: 1,
          completed: false
        },
        {
          _id: uuidv4(),
          createdAt: Date.now(),
          lastModified: Date.now(),
          name: "Thrid Thing",
          status: 0,
          completed: true
        },
      ]
    }

  ]
}

const gen_dummy_group = () => ({
  _id: uuidv4(),
  title: "Placeholder",
  createdAt: Date.now(),
  status: 1,
  tasks: []
  })
export {dummy_data, gen_dummy_group};