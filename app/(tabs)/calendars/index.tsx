import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles, layoutStyles, spacing } from '../../../styles';
import Text from '../../../components/ui/atoms/Text';
import Card from '../../../components/ui/Card';
import Header from '../../../components/ui/organisms/Header';
import Button from '../../../components/ui/Button';
import { Event } from '../../../types/events';
import eventsData from '../../../data/events.json';
import categoriesData from '../../../data/categories.json';

interface CalendarDay {
  day: number | null;
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  events: Event[];
}

export default function CalendarScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  // Conversion des données événements avec format de date adapté
  const events: Event[] = eventsData.map(event => ({
    ...event,
    date: convertDateFormat(event.date), // Convertit "15/12/2024" -> "2024-12-15"
    status: event.status as "upcoming" | "ongoing" | "completed" | "cancelled"
  }));

  function convertDateFormat(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Génération du calendrier mensuel
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Premier jour du mois et dernier jour
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Jours du mois précédent pour remplir la première semaine
    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      const dateStr = prevDate.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateStr);
      
      days.push({
        day: prevDate.getDate(),
        date: dateStr,
        isCurrentMonth: false,
        isToday: false,
        hasEvents: dayEvents.length > 0,
        events: dayEvents
      });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateStr);
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      
      days.push({
        day,
        date: dateStr,
        isCurrentMonth: true,
        isToday,
        hasEvents: dayEvents.length > 0,
        events: dayEvents
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const selectedEvents = events.filter(event => event.date === selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getCategoryColor = (category: string): string => {
    const cat = categoriesData.find(c => c.name.toLowerCase() === category?.toLowerCase());
    return cat?.color || theme.primary;
  };

  const renderCalendarDay = (calendarDay: CalendarDay, index: number) => {
    const isSelected = calendarDay.date === selectedDate;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          {
            width: '14.28%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginBottom: spacing[1],
          },
          isSelected && {
            backgroundColor: theme.primary,
          },
          calendarDay.isToday && !isSelected && {
            backgroundColor: theme.primaryLight,
          }
        ]}
        onPress={() => calendarDay.day && setSelectedDate(calendarDay.date)}
        disabled={!calendarDay.day}
      >
        {calendarDay.day && (
          <>
            <Text 
              variant="body" 
              weight={calendarDay.isToday ? "semibold" : "normal"}
              style={{
                color: isSelected 
                  ? '#FFF' 
                  : calendarDay.isCurrentMonth 
                    ? theme.text 
                    : theme.textTertiary,
              }}
            >
              {calendarDay.day}
            </Text>
            
            {/* Indicateurs d'événements */}
            {calendarDay.hasEvents && (
              <View style={[layoutStyles.row, { marginTop: 2 }]}>
                {calendarDay.events.slice(0, 3).map((event, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: isSelected 
                        ? '#FFF' 
                        : getCategoryColor(event.category || ''),
                      marginHorizontal: 1,
                    }}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  const renderEventItem = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      onPress={() => router.push(`/events/${event.id}`)}
      style={{ marginBottom: spacing[3] }}
    >
      <Card variant="elevated" padding="medium">
        <View style={[layoutStyles.rowBetween, { alignItems: 'flex-start' }]}>
          <View style={[layoutStyles.row, { flex: 1, alignItems: 'flex-start' }]}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: getCategoryColor(event.category || ''),
                marginRight: spacing[3],
                marginTop: 4,
              }}
            />
            
            <View style={{ flex: 1 }}>
              <Text variant="body" weight="semibold" numberOfLines={1}>
                {event.title}
              </Text>
              
              <Text variant="caption" color="secondary" style={{ marginTop: spacing[1] }}>
                {event.time} • {event.location}
              </Text>
              
              {event.description && (
                <Text variant="small" color="tertiary" numberOfLines={2} style={{ marginTop: spacing[1] }}>
                  {event.description}
                </Text>
              )}
              
              <View style={[layoutStyles.row, { marginTop: spacing[2], alignItems: 'center' }]}>
                <Ionicons name="people" size={14} color={theme.textSecondary} />
                <Text variant="small" color="secondary" style={{ marginLeft: spacing[1] }}>
                  {event.participants} participant{event.participants > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[layoutStyles.container, themedStyles.surface]}>
      {/* Header personnalisé */}
      <Header
        title="Calendrier"
        rightAction={{
          icon: "add-circle",
          onPress: () => router.push('/modals/create-event')
        }}
      />

      <ScrollView style={layoutStyles.container} showsVerticalScrollIndicator={false}>
        {/* Navigation mensuelle */}
        <View style={[
          layoutStyles.rowBetween, 
          { 
            paddingHorizontal: spacing[5], 
            paddingVertical: spacing[4],
            alignItems: 'center'
          }
        ]}>
          <TouchableOpacity
            onPress={() => navigateMonth('prev')}
            style={{
              padding: spacing[2],
              borderRadius: 8,
              backgroundColor: theme.backgroundSecondary,
            }}
          >
            <Ionicons name="chevron-back" size={20} color={theme.text} />
          </TouchableOpacity>

          <Text variant="h3" weight="semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>

          <TouchableOpacity
            onPress={() => navigateMonth('next')}
            style={{
              padding: spacing[2],
              borderRadius: 8,
              backgroundColor: theme.backgroundSecondary,
            }}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Grille du calendrier */}
        <View style={{ paddingHorizontal: spacing[5] }}>
          {/* En-têtes des jours */}
          <View style={[layoutStyles.row, { marginBottom: spacing[3] }]}>
            {weekDays.map(day => (
              <View key={day} style={{ width: '14.28%', alignItems: 'center' }}>
                <Text variant="caption" weight="semibold" color="secondary">
                  {day}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Grille des jours */}
          <View style={[layoutStyles.row, { flexWrap: 'wrap' }]}>
            {calendarDays.map(renderCalendarDay)}
          </View>
        </View>

        {/* Section des événements */}
        <View style={{ 
          paddingHorizontal: spacing[5], 
          paddingTop: spacing[6],
          paddingBottom: spacing[8] 
        }}>
          <View style={[layoutStyles.rowBetween, { marginBottom: spacing[4] }]}>
            <Text variant="h3" weight="semibold">
              Événements
            </Text>
            <Text variant="caption" color="secondary">
              {new Date(selectedDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long'
              })}
            </Text>
          </View>
          
          {selectedEvents.length > 0 ? (
            selectedEvents.map(renderEventItem)
          ) : (
            <Card variant="flat" padding="large">
              <View style={layoutStyles.centerHorizontal}>
                <Ionicons 
                  name="calendar-outline" 
                  size={48} 
                  color={theme.textTertiary} 
                  style={{ marginBottom: spacing[3] }}
                />
                <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                  Aucun événement ce jour
                </Text>
                <Text variant="caption" color="tertiary" style={{ 
                  textAlign: 'center', 
                  marginTop: spacing[1] 
                }}>
                  Appuyez sur + pour créer un événement
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 