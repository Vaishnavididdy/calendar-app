import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

export const fetchEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
};

export const createEvent = async (event) => {
  const response = await axios.post(API_URL, event);
  return { ...response.data, start: new Date(response.data.start), end: new Date(response.data.end) };
};

export const updateEvent = async (id, event) => {
  const response = await axios.put(`${API_URL}/${id}`, event);
  return { ...response.data, start: new Date(response.data.start), end: new Date(response.data.end) };
};

export const deleteEvent = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};