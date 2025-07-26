import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { themedStyles } from "../styles/global";
import { loggerService } from "../services/LoggerService";

interface LogEntry {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug' | 'log';
  message: string;
  timestamp: Date;
}

export default function DebuggerView() {
  const { theme } = useTheme();
  const styles = themedStyles(theme);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // S'abonner au service de logs
  useEffect(() => {
    const unsubscribe = loggerService.subscribe((newLogs) => {
      setLogs(newLogs);
    });

    return unsubscribe;
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#ef4444';
      case 'warn': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'debug': return '#6b7280';
      case 'log': return '#10b981';
      default: return theme.text;
    }
  };

  const clearLogs = () => {
    loggerService.clearLogs();
  };

  return (
    <View style={[styles.container, { height: '100%', paddingHorizontal: 20 }]}>
      <View style={localStyles.header}>
        <Text style={styles.titleLg}>Console</Text>
        <TouchableOpacity onPress={clearLogs} style={[localStyles.clearButton, { borderColor: theme.text }]}>
          <Text style={[localStyles.clearButtonText, { color: theme.text }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
       style={localStyles.logsContainer}>
        {logs.map((log) => (
          <View key={log.id} style={[localStyles.logItem, { borderColor: theme.text }]}>
            <View style={localStyles.logHeader}>
              <Text style={[localStyles.logLevel, { color: getLevelColor(log.level) }]}>
                {log.level.toUpperCase()}
              </Text>
              <Text style={[localStyles.logTime, { color: theme.text }]}>
                {log.timestamp.toLocaleTimeString()}
              </Text>
            </View>
            <Text style={[localStyles.logMessage, { color: theme.text }]}>
              {log.message}
            </Text>
          </View>
        ))}
        {logs.length === 0 && (
          <Text style={[localStyles.noLogs, { color: theme.text }]}>
            Aucun log
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  clearButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 10,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  logsContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logItem: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logLevel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  logTime: {
    fontSize: 10,
  },
  logMessage: {
    fontSize: 14,
    lineHeight: 18,
  },
  noLogs: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
