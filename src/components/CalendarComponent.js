import React, { useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModal from './EventModal';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents, updateEvent } from '../redux/slices/eventSlice';
import { fetchEvents, updateEvent as updateEventApi } from '../api/eventApi';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ modalOpen, setModalOpen, newEvent, setNewEvent, openModalForDate }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);

  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await fetchEvents();
      const updatedEvents = fetchedEvents.map(event => ({
        ...event,
        color: event.color || '#1E90FF' // Force #1E90FF as default for loaded events
      }));
      dispatch(setEvents(updatedEvents));
    };
    loadEvents();
  }, [dispatch]);

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({
      title: '',
      category: 'exercise',
      start: new Date(start),
      end: new Date(end),
      color: '#1E90FF', // Explicitly set to #1E90FF
      notification: '5 minutes before',
      customNotificationTime: '',
      repeat: 'doesNotRepeat',
      location: '',
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setNewEvent({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    });
    setModalOpen(true);
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start: new Date(start), end: new Date(end), color: '#1E90FF' }; // Enforce #1E90FF on drop
    await updateEventApi(event._id, updatedEvent);
    dispatch(updateEvent(updatedEvent));
  };

  const customTimeGutterHeader = () => {
    return <span style={{ visibility: 'hidden' }} />;
  };

  const eventPropGetter = (event, start, end, isSelected) => {
    const backgroundColor = event.color || '#1E90FF'; // Default to #1E90FF
    return {
      style: {
        backgroundColor,
      },
    };
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        eventPropGetter={eventPropGetter}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={['month', 'week', 'day', 'agenda']}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        draggableAccessor={() => true}
        resizable
        style={{ height: '90vh' }}
        components={{
          timeGutterHeader: customTimeGutterHeader,
        }}
      />
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setNewEvent({
            title: '',
            category: 'exercise',
            start: new Date(),
            end: new Date(),
            color: '#1E90FF', // Reset to #1E90FF
            notification: '5 minutes before',
            customNotificationTime: '',
            repeat: 'doesNotRepeat',
            location: '',
          });
        }}
        event={newEvent}
        setEvent={setNewEvent}
        isEdit={!!newEvent._id}
      />
    </div>
  );
};

export default CalendarComponent;