import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types/events';

interface EventContextType {
  events: Event[];
  setEvents: (events: Event[]) => void;
  updateEvent: (updatedEvent: Event) => void;
  addEvent: (event: Event) => void;
  removeEvent: (eventId: number) => void;
  refreshEvents: () => void;
  getEventById: (eventId: number) => Event | undefined;
  updateEventParticipant: (eventId: number, participantId: number, isActive: boolean) => void;
  addEventParticipant: (eventId: number, participant: any) => void;
  removeEventParticipant: (eventId: number, participantId: number) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const updateEvent = useCallback((updatedEvent: Event) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(e => 
        e.id === updatedEvent.id ? updatedEvent : e
      );
      console.log('🔄 Mise à jour de l\'événement dans le contexte:', updatedEvent.title);
      return newEvents;
    });
  }, []);

  const addEvent = useCallback((event: Event) => {
    setEvents(prevEvents => {
      const newEvents = [...prevEvents, event];
      console.log('➕ Ajout de l\'événement dans le contexte:', event.title);
      return newEvents;
    });
  }, []);

  const removeEvent = useCallback((eventId: number) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.filter(e => e.id !== eventId);
      console.log('🗑️ Suppression de l\'événement du contexte:', eventId);
      return newEvents;
    });
  }, []);

  const refreshEvents = useCallback(() => {
    console.log('🔄 Rafraîchissement des événements dans le contexte');
    // Cette fonction sera utilisée pour forcer un rechargement depuis l'API
  }, []);

  const getEventById = useCallback((eventId: number) => {
    return events.find(e => e.id === eventId);
  }, [events]);

  const updateEventParticipant = useCallback((eventId: number, participantId: number, isActive: boolean) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          // Mettre à jour le statut du participant
          const updatedParticipants = event.participants?.map(p => 
            p.id === participantId ? { ...p, is_active: isActive } : p
          ) || [];
          
          return {
            ...event,
            participants: updatedParticipants
          };
        }
        return event;
      });
      
      console.log('🔄 Mise à jour du participant dans l\'événement:', eventId, participantId, isActive);
      return newEvents;
    });
  }, []);

  const addEventParticipant = useCallback((eventId: number, participant: any) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          const updatedParticipants = [...(event.participants || []), participant];
          
          return {
            ...event,
            participants: updatedParticipants
          };
        }
        return event;
      });
      
      console.log('➕ Ajout du participant dans l\'événement:', eventId, participant.id);
      return newEvents;
    });
  }, []);

  const removeEventParticipant = useCallback((eventId: number, participantId: number) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          const updatedParticipants = event.participants?.filter(p => p.id !== participantId) || [];
          
          return {
            ...event,
            participants: updatedParticipants
          };
        }
        return event;
      });
      
      console.log('🗑️ Suppression du participant de l\'événement:', eventId, participantId);
      return newEvents;
    });
  }, []);

  const value: EventContextType = {
    events,
    setEvents,
    updateEvent,
    addEvent,
    removeEvent,
    refreshEvents,
    getEventById,
    updateEventParticipant,
    addEventParticipant,
    removeEventParticipant
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
