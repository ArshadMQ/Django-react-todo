import React, { useState, useEffect, useContext } from 'react';
import todoContext from "../context/todoContext"
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { FaHourglassStart } from "react-icons/fa";
import '../App.css'
import { useNavigate } from 'react-router-dom';

const Main_Component = () => {
  const { CreateTask, showAlert, listTasks, getListTasks, getCookie, getListTasksByFilter, DeleteTask, UpdateTask, UpdateStatusTask } = useContext(todoContext)

  const navigate = useNavigate()

  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const [taskItem, setTask] = useState({ title: "", description: "" })
  const HandleonClick = (e) => {
    setTask({ ...taskItem, [e.target.name]: e.target.value })
  }
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const jsonResponse = await CreateTask(taskItem);
    if (jsonResponse.success) {
      showAlert(jsonResponse.detail, "success")
    }
    if (getCookie("access_token")) {
      await getListTasks()
    }
    else {
      navigate('/login')
    }

  }

  const handleDeleteTodo = async item => {
    var item_id = item.id
    await DeleteTask(item_id)
    if (getCookie("access_token")) {
      await getListTasks()
      showAlert("Task Deleted Successfully", "success")
    }
    else {
      navigate('/login')
    }

  };

  const handleInprogress = async (index, item) => {
    var item_id = item.id
    await UpdateStatusTask(item_id, "In Progress")
    if (getCookie("access_token")) {
      await getListTasks()
      showAlert("Sattus updated Successfully", "success")
    }
    else {
      navigate('/login')
    }
  };

  const handleComplete = async (index, item) => {
    var item_id = item.id
    await UpdateStatusTask(item_id, "Done")
    if (getCookie("access_token")) {
      await getListTasks()
      showAlert("Sattus updated Successfully", "success")
    }
    else {
      navigate('/login')
    }
  };

  const handleDeleteCompletedTodo = index => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index);

    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  useEffect(() => {
    if (getCookie("access_token")) {
      getListTasks()
    }
    else {
      navigate('/login')
    }
    //eslint-disable-next-line
  }, []);


  const handleEdit = (ind, item) => {
    setCurrentEdit(ind);
    setCurrentEditedItem(item);

  }

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value }
    })
  }

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value }
    })
  }

  const handleUpdateToDo = async () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    setCurrentEdit("");
    UpdateTask(currentEditedItem.id, currentEditedItem)
    if (getCookie("access_token")) {
      await getListTasks()
      showAlert("Task updated Successfully", "success")
    }
    else {
      navigate('/login')
    }
  }
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setSelectedFilter(filter)
    getListTasksByFilter(filter)

  };

  return (
    <div className="App">
      <h1>Todo System</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              name="title"
              onChange={HandleonClick}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              name="description"
              onChange={HandleonClick}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleSubmitForm}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="filter">Filter Tasks:</label>
                <select
                  id="filter"
                  className="form-control"
                  value={selectedFilter}
                  onChange={handleFilterChange}>
                  <option value="All">All</option>
                  <option value="To Do">TODO</option>
                  <option value="Done">Done</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="todo-list">

          {isCompleteScreen === false &&
            listTasks.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className='edit__wrapper' key={index}>
                    <input placeholder='Updated Title'
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title} />
                    <textarea placeholder='Updated Title'
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description} />
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                )
              } else {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div style={{ display: "flex" }}>
                      {item.status === "In Progress" && (
                        <div>
                          <BsCheckLg className="check-icon" value={item} onClick={() => handleComplete(index, item)} title="Complete?" />
                        </div>
                      )}
                      {item.status === "To Do" && (
                        <div>
                          <FaHourglassStart className="check-load" value={item} onClick={() => handleInprogress(index, item)} title="In Progress?" />
                        </div>
                      )}
                      {item.status !== "Done" ?
                        <div>
                          <AiOutlineEdit className="check-icon" value={item} onClick={() => handleEdit(index, item)} title="Edit?" />
                        </div>
                        : null}
                      <div>
                        <AiOutlineDelete className="icon" values={item.id} onClick={() => handleDeleteTodo(item)} title="Delete?" />
                      </div>
                    </div>
                  </div>
                );
              }

            })}

          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                  </div>

                </div>
              );
            })}

        </div>
      </div>
    </div>
  );
}

export default Main_Component
