'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const DisasterContext = createContext();

export function DisasterProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Initial fetch
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.data.events);
          setRecommendations(data.data.recommendations);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Socket connection
    const socket = io('http://localhost:5000');
    socket.on('event:new', (data) => {
      setEvents(prev => [data.event, ...prev]);
      if (data.recommendation) {
        setRecommendations(prev => [data.recommendation, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, []);

  const handleAction = async (eventId, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/${action}`, { method: 'POST' });
      if (res.ok) {
        setEvents(prev => prev.map(e => e._id === eventId ? { ...e, status: action === 'approve' ? 'approved' : 'dismissed' } : e));
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent(prev => ({ ...prev, status: action === 'approve' ? 'approved' : 'dismissed' }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getRecommendation = (eventId) => recommendations.find(r => r.eventId === eventId);

  return (
    <DisasterContext.Provider value={{ 
      events, 
      loading, 
      handleAction, 
      getRecommendation,
      searchQuery,
      setSearchQuery,
      selectedEvent,
      setSelectedEvent
    }}>
      {children}
    </DisasterContext.Provider>
  );
}

export function useDisaster() {
  return useContext(DisasterContext);
}
