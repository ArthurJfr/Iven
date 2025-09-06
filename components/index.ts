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
// Note: DevNavigator, Debugger, DebuggerView ne semblent pas exister dans la structure actuelle
