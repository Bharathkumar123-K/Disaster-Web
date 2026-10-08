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
  const [notificationToast, setNotificationToast] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.data.events || []);
        setRecommendations(data.data.recommendations || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('[DisasterProvider] Error fetching events:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Socket connection
    const socket = io('http://localhost:5000');

    socket.on('event:new', (data) => {
      const newEvent = data.event;
      if (!newEvent || !newEvent._id) return;

      setEvents(prev => {
        // Prevent duplicate incidents
        if (prev.some(e => e._id === newEvent._id)) return prev;
        return [newEvent, ...prev];
      });

      if (data.recommendation) {
        setRecommendations(prev => {
          if (prev.some(r => r._id === data.recommendation._id || r.eventId === data.recommendation.eventId)) return prev;
          return [data.recommendation, ...prev];
        });
      }

      // Show real-time notification toast
      const isCitizen = newEvent.sourceType === 'CITIZEN' || newEvent.sourceType === 'CITIZEN_REPORT' || data.isCitizen;
      setNotificationToast({
        id: Date.now(),
        title: isCitizen ? '🆘 New Citizen SOS Report' : '🌐 New External Telemetry Signal',
        location: newEvent.locationName || 'Unknown Location',
        category: newEvent.category ? newEvent.category.toUpperCase() : 'DISASTER',
        severity: newEvent.severity || 'high',
        text: newEvent.text || '',
        isCitizen
      });
    });

    return () => socket.disconnect();
  }, []);

  const handleAction = async (eventId, action, payload = {}) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const updated = data.data;
        setEvents(prev => prev.map(e => e._id === eventId ? updated : e));
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent(updated);
        }
        return updated;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const approveIncident = async (eventId, operatorName = 'Operator Dispatcher', operatorNotes = 'Verified against source telemetry.') => {
    return await handleAction(eventId, 'approve', { operatorName, operatorNotes });
  };

  const rejectIncident = async (eventId, rejectionReason, operatorName = 'Operator Dispatcher', operatorNotes = '') => {
    return await handleAction(eventId, 'reject', { rejectionReason, reason: rejectionReason, operatorName, operatorNotes });
  };

  const updateEventDetails = async (eventId, updateData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const updated = data.data;
        setEvents(prev => prev.map(e => e._id === eventId ? updated : e));
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent(updated);
        }
        return updated;
      }
    } catch (e) {
      console.error('[DisasterProvider] Error updating event:', e);
    }
    return null;
  };

  const addOperatorNote = async (eventId, noteText) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteText, author: 'Operator Dispatcher' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const updated = data.data;
        setEvents(prev => prev.map(e => e._id === eventId ? updated : e));
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent(updated);
        }
        return updated;
      }
    } catch (e) {
      console.error('[DisasterProvider] Error adding note:', e);
    }
    return null;
  };

  const assignResponseTeam = async (eventId, assignedTeam, priorityLevel) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTeam, priorityLevel })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const updated = data.data;
        setEvents(prev => prev.map(e => e._id === eventId ? updated : e));
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent(updated);
        }
        return updated;
      }
    } catch (e) {
      console.error('[DisasterProvider] Error assigning team:', e);
    }
    return null;
  };

  const getRecommendation = (eventId) => recommendations.find(r => r.eventId === eventId);

  // Helper selectors for clean data separation
  const citizenEvents = events.filter(e => 
    e.sourceType === 'CITIZEN' || 
    e.sourceType === 'CITIZEN_REPORT' || 
    e.sourceType === 'CITIZEN_PORTAL' || 
    e.sourceType === 'CITIZEN_SOS'
  );

  const externalEvents = events.filter(e => 
    e.sourceType !== 'CITIZEN' && 
    e.sourceType !== 'CITIZEN_REPORT' && 
    e.sourceType !== 'CITIZEN_PORTAL' && 
    e.sourceType !== 'CITIZEN_SOS'
  );

  return (
    <DisasterContext.Provider value={{ 
      events, 
      citizenEvents,
      externalEvents,
      recommendations,
      loading, 
      handleAction, 
      approveIncident,
      rejectIncident,
      updateEventDetails,
      addOperatorNote,
      assignResponseTeam,
      getRecommendation,
      searchQuery,
      setSearchQuery,
      selectedEvent,
      setSelectedEvent,
      notificationToast,
      clearNotificationToast: () => setNotificationToast(null),
      refreshEvents: fetchEvents
    }}>
      {children}
    </DisasterContext.Provider>
  );
}

export function useDisaster() {
  return useContext(DisasterContext);
}
