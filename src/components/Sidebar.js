import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGoal } from '../redux/slices/goalSlice';
import { FaHome } from 'react-icons/fa';
import TaskEventModal from './TaskEventModal';

const Sidebar = ({ setModalOpen, setNewEvent }) => {
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.goals.goals);
  const selectedGoal = useSelector((state) => state.goals.selectedGoal);
  
  // Add state for task modal
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskEvent, setTaskEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState('');

  const handleGoalClick = (goal) => {
    dispatch(selectGoal(goal));
  };

  const handleTaskClick = (task, goal) => {
    // Set the selected task
    setSelectedTask(task);
    
    // Create a new event object with #1E90FF color
    const newTaskEvent = {
      title: goal.name, // Goal name as title
      category: task.toLowerCase(), // Task name as category
      start: new Date(),
      end: new Date(new Date().getTime() + 30 * 60 * 1000),
      color: '#1E90FF', // Use #1E90FF for all events
      repeat: 'doesNotRepeat',
      location: '',
      notification: '5 minutes before',
      customNotificationTime: '',
    };
    
    setTaskEvent(newTaskEvent);
    setTaskModalOpen(true);
  };

  const handleTaskDrop = (e, date) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('task'));
    
    // Set the selected task
    setSelectedTask(data.task);
    
    // Create a new event object with #1E90FF color
    const newTaskEvent = {
      title: data.goal.name, // Goal name as title
      category: data.task.toLowerCase(), // Task name as category
      start: new Date(date),
      end: new Date(date.getTime() + 30 * 60 * 1000),
      color: '#1E90FF', // Use #1E90FF for all events regardless of goal color
      repeat: 'doesNotRepeat',
      location: '',
      notification: '5 minutes before',
      customNotificationTime: '',
    };
    
    setTaskEvent(newTaskEvent);
    setTaskModalOpen(true);
  };

  return (
    <div className="sidebar">
      <h3>Goals</h3>
      <ul className="goal-list">
        {goals.map((goal) => (
          <li
            key={goal.name}
            onClick={() => handleGoalClick(goal)}
            className={`goal-item ${selectedGoal?.name === goal.name ? 'selected' : ''}`}
            style={{ backgroundColor: goal.color }}
          >
            <FaHome className="sidebar-icon" />
            {goal.name}
          </li>
        ))}
      </ul>
      {selectedGoal && (
        <>
          <h3>Tasks</h3>
          <ul
            className="task-list"
            onDrop={(e) => handleTaskDrop(e, new Date())}
            onDragOver={(e) => e.preventDefault()}
          >
            {selectedGoal.tasks.map((task) => (
              <li
                key={task}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData('task', JSON.stringify({ task, goal: selectedGoal }))
                }
                onClick={() => handleTaskClick(task, selectedGoal)}
                className="task-item"
                style={{ backgroundColor: selectedGoal.color }}
              >
                <FaHome className="sidebar-icon" />
                {task}
              </li>
            ))}
          </ul>
        </>
      )}
      
      {/* Task Event Modal */}
      {taskEvent && (
        <TaskEventModal
          isOpen={taskModalOpen}
          onClose={() => {
            setTaskModalOpen(false);
            setTaskEvent(null);
          }}
          event={taskEvent}
          setEvent={setTaskEvent}
          isEdit={!!taskEvent._id}
          selectedGoal={selectedGoal}
          selectedTask={selectedTask}
        />
      )}
    </div>
  );
};

export default Sidebar;