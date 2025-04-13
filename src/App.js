import React, { useState } from 'react';
import CalendarComponent from './components/CalendarComponent';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const initialEventState = {
    title: '',
    category: 'exercise',
    start: new Date(),
    end: new Date(),
    color: '#1E90FF', // Updated default color to #1E90FF
    notification: '5 minutes before',
    customNotificationTime: '',
    repeat: 'doesNotRepeat',
    location: '',
  };
  const [newEvent, setNewEvent] = useState(initialEventState);

  const openModalForDate = (start, end) => {
    setNewEvent({
      ...initialEventState,
      start: new Date(start),
      end: new Date(end),
    });
    setModalOpen(true);
  };

  return (
    <div className="app">
      <Sidebar setModalOpen={setModalOpen} setNewEvent={setNewEvent} />
      <div className="calendar-container">
        <CalendarComponent
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          openModalForDate={openModalForDate}
        />
      </div>
    </div>
  );
};

export default App;