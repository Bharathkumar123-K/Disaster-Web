'use client';

import { useState, useEffect } from 'react';

export default function EventsTable() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('http://localhost:5000/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        
        const json = await res.json();
        if (json.success) {
          setEvents(json.data);
        } else {
          throw new Error(json.error || 'Unknown error');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading live data...</div>;
  if (error) return <div className="error">Error loading data: {error}</div>;
  if (events.length === 0) return <div className="loading">No events found. Waiting for ingestion...</div>;

  return (
    <table className="events-table">
      <thead>
        <tr>
          <th>Source</th>
          <th>Title / Description</th>
          <th>Date Reported</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event._id || event.sourceId}>
            <td>
              <span className="badge">{event.source.replace('_', ' ')}</span>
            </td>
            <td>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                {event.title || 'No Title'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {event.text && event.text.length > 100 
                  ? event.text.substring(0, 100) + '...' 
                  : event.text}
              </div>
            </td>
            <td style={{ whiteSpace: 'nowrap' }}>
              {new Date(event.rawTimestamp || event.fetchedAt).toLocaleString()}
            </td>
            <td>
              {event.url ? (
                <a href={event.url} target="_blank" rel="noopener noreferrer" className="btn-link">
                  View Source ↗
                </a>
              ) : (
                <span style={{ color: 'var(--text-secondary)' }}>N/A</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
