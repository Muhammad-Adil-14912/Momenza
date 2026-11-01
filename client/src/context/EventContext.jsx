import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!isAuthenticated) {
      setEvents([]);
      setActiveEvent(null);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/events');
      if (res.data?.success) {
        const list = res.data.events || [];
        setEvents(list);

        // Check if there is an active event ID saved in localStorage
        const savedId = localStorage.getItem('momenza_active_event_id');
        const match = list.find(e => (e._id || e.id) === savedId);
        if (match) {
          selectEvent(match);
        } else if (list.length > 0) {
          selectEvent(list[0]);
        } else {
          setActiveEvent(null);
          setTasks([]);
          setExpenses([]);
          setGuests([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [isAuthenticated]);

  const selectEvent = async (eventOrId) => {
    const eventId = typeof eventOrId === 'string' ? eventOrId : (eventOrId?._id || eventOrId?.id);
    if (!eventId) return;

    try {
      localStorage.setItem('momenza_active_event_id', eventId);
      const res = await api.get(`/events/${eventId}`);
      if (res.data?.success) {
        setActiveEvent(res.data.event);
        setTasks(res.data.tasks || []);
        setExpenses(res.data.expenses || []);
        setGuests(res.data.guests || []);
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
    }
  };

  const refreshActiveEventDetails = async () => {
    if (!activeEvent?._id) return;
    await selectEvent(activeEvent._id);
  };

  const createNewEvent = async (eventData) => {
    try {
      const res = await api.post('/events', eventData);
      if (res.data?.success) {
        const created = res.data.event;
        await fetchEvents();
        await selectEvent(created._id);
        return created;
      }
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    }
  };

  const updateActiveEvent = async (updates) => {
    if (!activeEvent?._id) return;
    try {
      const res = await api.put(`/events/${activeEvent._id}`, updates);
      if (res.data?.success) {
        setActiveEvent(res.data.event);
        setEvents(prev => prev.map(e => (e._id === activeEvent._id ? res.data.event : e)));
        return res.data.event;
      }
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  const deleteActiveEvent = async (eventId) => {
    const id = eventId || activeEvent?._id;
    if (!id) return;
    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data?.success) {
        localStorage.removeItem('momenza_active_event_id');
        await fetchEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        activeEvent,
        tasks,
        expenses,
        guests,
        loading,
        fetchEvents,
        selectEvent,
        refreshActiveEventDetails,
        createNewEvent,
        updateActiveEvent,
        deleteActiveEvent,
        setTasks,
        setExpenses,
        setGuests
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
