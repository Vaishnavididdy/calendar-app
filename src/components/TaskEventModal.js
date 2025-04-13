import React from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent, deleteEvent } from '../redux/slices/eventSlice';
import { createEvent, updateEvent as updateEventApi, deleteEvent as deleteEventApi } from '../api/eventApi';
import moment from 'moment';
import { FaPen, FaCalendarAlt, FaClock, FaSync, FaMapMarkerAlt, FaBell } from 'react-icons/fa';

Modal.setAppElement('#root');

const TaskEventModal = ({ isOpen, onClose, event, setEvent, isEdit, selectedGoal, selectedTask }) => {
  const dispatch = useDispatch();

  const defaultColor = '#1E90FF';

  const taskToCategory = {
    workout: 'exercise',
    yoga: 'exercise',
    running: 'exercise',
    soccer: 'exercise',
    basketball: 'exercise',
    swimming: 'exercise',
    'study math': 'work',
    'write essay': 'work',
    'revise notes': 'work',
    'ai based agents': 'work',
    mle: 'work',
    'de related': 'work',
    basics: 'work',
  };

  const notificationOptions = [
    '5 minutes before',
    '10 minutes before',
    '15 minutes before',
    '1 hour before',
    '1 day before',
    'custom',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (event.notification === 'custom' && !event.customNotificationTime) {
      alert('Please specify a custom notification time.');
      return;
    }

    const normalizedCategory = taskToCategory[selectedTask?.toLowerCase()] || 'work';
    const updatedEvent = {
      ...event,
      title: selectedGoal?.name || event.title,
      category: normalizedCategory,
      start: new Date(event.start),
      end: new Date(event.end),
      color: event.color || defaultColor,
      notification: event.notification === 'custom' ? event.customNotificationTime : event.notification,
    };

    if (isEdit) {
      await updateEventApi(event._id, updatedEvent);
      dispatch(updateEvent(updatedEvent));
    } else {
      const newEvent = await createEvent(updatedEvent);
      dispatch(addEvent(newEvent));
    }
    onClose();
  };

  const handleDelete = async () => {
    if (isEdit && window.confirm('Are you sure you want to delete this event?')) {
      await deleteEventApi(event._id);
      dispatch(deleteEvent(event._id));
      onClose();
    }
  };

  if (!event) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="react-modal-content"
      overlayClassName="react-modal-overlay"
    >
      <h2>{isEdit ? 'Edit Task Event' : 'Create Task Event'}</h2>
      <button className="close-btn" onClick={onClose}>×</button>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label><FaPen /> Goal</label>
          <input
            type="text"
            value={selectedGoal?.name || ''}
            disabled
            className="with-icon"
          />
        </div>
        <div className="input-group">
          <label><FaPen /> Task</label>
          <input
            type="text"
            value={selectedTask || ''}
            disabled
            className="with-icon"
          />
        </div>
        <div className="input-group">
          <label><FaCalendarAlt /> Start Time</label>
          <input
            type="datetime-local"
            value={event.start ? moment(event.start).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={(e) => setEvent({ ...event, start: new Date(e.target.value) })}
            required
            className="with-icon"
          />
        </div>
        <div className="input-group">
          <label><FaClock /> End Time</label>
          <input
            type="datetime-local"
            value={event.end ? moment(event.end).format('YYYY-MM-DDTHH:mm') : ''} // Fixed: changed 'end' to 'event.end'
            onChange={(e) => setEvent({ ...event, end: new Date(e.target.value) })}
            required
            className="with-icon"
          />
        </div>
        <div className="input-group">
          <label><FaSync /> Does it Repeat</label>
          <select
            value={event.repeat || 'doesNotRepeat'}
            onChange={(e) => setEvent({ ...event, repeat: e.target.value })}
            className="with-icon"
          >
            <option value="doesNotRepeat">Does not repeat</option>
            <option value="everyDay">Every day</option>
            <option value="everyWeek">Every week</option>
            <option value="everyMonth">Every month</option>
            <option value="everyYear">Every year</option>
            <option value="custom">Custom...</option>
          </select>
        </div>
        <div className="input-group">
          <label><FaMapMarkerAlt /> Add Location</label>
          <input
            type="text"
            value={event.location || ''}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            placeholder="Add Location"
            className="with-icon"
          />
        </div>
        <div className="input-group">
          <label><FaBell /> Notification</label>
          <select
            value={event.notification || '5 minutes before'}
            onChange={(e) => setEvent({ ...event, notification: e.target.value })}
            className="with-icon"
          >
            {notificationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {event.notification === 'custom' && (
          <div className="input-group">
            <label><FaBell /> Custom Notification Time</label>
            <input
              type="datetime-local"
              value={event.customNotificationTime || ''}
              onChange={(e) => setEvent({ ...event, customNotificationTime: e.target.value })}
              required
              className="with-icon"
            />
          </div>
        )}
        <div>
          <button type="submit">{isEdit ? 'Update Event' : 'Save'}</button>
          <button type="button" onClick={onClose}>Cancel</button>
          {isEdit && (
            <button type="button" className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default TaskEventModal;