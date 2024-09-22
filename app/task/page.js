"use client";
import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFlag, FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import styles from "./Task.module.css";

const Header = () => (
  <header className={styles.header}>
    <h1 className={styles.headerTitle}>TaskMaster</h1>
  </header>
);

const TaskFormStep1 = ({ title, setTitle, desc, setDesc, goToNextStep }) => (
  <div className={styles.form}>
    <div className={styles.inputGroup}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.inputField}
        required
      />
    </div>
    <div className={styles.inputGroup}>
      <textarea
        placeholder="Task Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className={styles.textArea}
        required
      />
    </div>
    <button className={styles.nextButton} onClick={goToNextStep}>
      Next
    </button>
  </div>
);

const TaskFormStep2 = ({ priority, setPriority, dueDate, setDueDate, submitHandler, isEditing }) => (
  <form onSubmit={submitHandler} className={styles.form}>
    <div className={styles.inputGroup}>
      <FaFlag className={styles.inputIcon} />
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className={styles.selectField}>
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
    </div>
    <div className={styles.inputGroup}>
      <FaCalendarAlt className={styles.inputIcon} />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={styles.inputField}
        required
      />
    </div>
    <button type="submit" className={styles.submitButton}>
      {isEditing !== null ? <FaEdit /> : <FaPlus />}
      {isEditing !== null ? "Update Task" : "Add Task"}
    </button>
  </form>
);

const Task = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [step, setStep] = useState(1);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    setTasks(storedTasks);
    setCompletedTasks(storedCompletedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (title && desc && dueDate) {
      const newTask = { title, desc, priority, dueDate, createdAt: new Date().toISOString() };
      if (isEditing !== null) {
        const updatedTasks = tasks.map((task, index) =>
          index === isEditing ? { ...newTask, createdAt: task.createdAt } : task
        );
        setTasks(updatedTasks);
        setIsEditing(null);
      } else {
        setTasks([...tasks, newTask]);
      }
      setTitle("");
      setDesc("");
      setPriority("Low");
      setDueDate("");
      setStep(1); // Go back to step 1 for the next task
    }
  };

  const deleteHandler = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editHandler = (index) => {
    const taskToEdit = tasks[index];
    setTitle(taskToEdit.title);
    setDesc(taskToEdit.desc);
    setPriority(taskToEdit.priority);
    setDueDate(taskToEdit.dueDate);
    setIsEditing(index);
    setStep(1); // Go back to step 1 for editing
  };

  const completeTaskHandler = (index) => {
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, { ...taskToComplete, completedAt: new Date().toISOString() }]);
    deleteHandler(index);
  };

  const clearAllHandler = () => {
    setTasks([]);
    setCompletedTasks([]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return styles.highPriority;
      case "Medium":
        return styles.mediumPriority;
      default:
        return styles.lowPriority;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.priority.toLowerCase() === filter.toLowerCase();
  });

  const renderTasks = filteredTasks.length > 0 ? (
    filteredTasks.map((task, index) => (
      <li key={index} className={`${styles.taskItem} ${getPriorityColor(task.priority)}`}>
        <div className={styles.taskContent}>
          <h3>{task.title}</h3>
          <p>{task.desc}</p>
          <p>
            <FaCalendarAlt /> Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <FaFlag /> Priority: {task.priority}
          </p>
        </div>
        <div className={styles.taskActions}>
          <button className={`${styles.actionButton} ${styles.completeButton}`} onClick={() => completeTaskHandler(index)}>
            <FaCheck />
          </button>
          <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => editHandler(index)}>
            <FaEdit />
          </button>
          <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => deleteHandler(index)}>
            <FaTrash />
          </button>
        </div>
      </li>
    ))
  ) : (
    <p className={styles.noTask}>No tasks available</p>
  );

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <section className={styles.taskFormSection}>
          <h2 className={styles.sectionTitle}>Add New Task</h2>
          {step === 1 ? (
            <TaskFormStep1 title={title} setTitle={setTitle} desc={desc} setDesc={setDesc} goToNextStep={() => setStep(2)} />
          ) : (
            <TaskFormStep2
              priority={priority}
              setPriority={setPriority}
              dueDate={dueDate}
              setDueDate={setDueDate}
              submitHandler={submitHandler}
              isEditing={isEditing}
            />
          )}
        </section>
        <section className={styles.taskListSection}>
          <div className={styles.filterContainer}>
            <label htmlFor="filter">Filter by priority: </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.selectField}
            >
              <option value="all">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <h2 className={styles.sectionTitle}>Active Tasks</h2>
          <ul className={styles.taskList}>{renderTasks}</ul>
        </section>
        {completedTasks.length > 0 && (
          <section className={styles.completedTasksSection}>
            <h2 className={styles.sectionTitle}>Completed Tasks</h2>
            <ul className={styles.taskList}>
              {completedTasks.map((task, index) => (
                <li key={index} className={`${styles.taskItem} ${styles.completedTask}`}>
                  <div className={styles.taskContent}>
                    <h3>{task.title}</h3>
                    <p>
                      <FaCheck /> Completed on: {new Date(task.completedAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {(tasks.length > 0 || completedTasks.length > 0) && (
          <button onClick={clearAllHandler} className={`${styles.actionButton} ${styles.clearAllButton}`}>
            <FaTrash /> Clear All Tasks
          </button>
        )}
      </main>
    </div>
  );
};

export default Task;
