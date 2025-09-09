// Index principal des composants - Architecture organisée par fonctionnalités

// Design System (Atomic Design)
export * from './ui';

// Composants spécifiques aux fonctionnalités
export * from './features/events';
export * from './features/tasks';
export * from './features/auth';
export * from './features/home';

// Composants partagés
export * from './shared';

// Templates de layout
export * from './ui/templates';

// Composants utilitaires
export { default as AuthInitializer } from './AuthInitializer';
export { default as ProtectedRoute } from './ProtectedRoute';
// à supprimer
export { default as DevNavigator } from './DevNavigator';
// à supprimer
export { default as Debugger } from './Debugger';
// à supprimer
export { default as DebuggerView } from './DebuggerView';
