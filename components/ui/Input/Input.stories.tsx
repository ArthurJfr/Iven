// Storybook/exemples pour le composant Input
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from './Input';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Exemples d'utilisation du composant Input

export const BasicInput = () => {
  const [value, setValue] = useState('');
  
  return (
    <Input
      label="Email"
      placeholder="votre@email.com"
      value={value}
      onChangeText={setValue}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  );
};

export const PasswordInput = () => {
  const [password, setPassword] = useState('');
  
  return (
    <Input
      label="Mot de passe"
      placeholder="••••••••"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      showPasswordToggle
      required
    />
  );
};

export const InputWithIcons = () => {
  const [search, setSearch] = useState('');
  
  return (
    <Input
      label="Rechercher"
      placeholder="Tapez votre recherche..."
      value={search}
      onChangeText={setSearch}
      leftIcon="search"
      rightIcon="close-circle"
      onRightIconPress={() => setSearch('')}
    />
  );
};

export const InputSizes = () => {
  const [small, setSmall] = useState('');
  const [medium, setMedium] = useState('');
  const [large, setLarge] = useState('');
  
  return (
    <View style={styles.container}>
      <Input
        label="Small"
        size="small"
        placeholder="Small input"
        value={small}
        onChangeText={setSmall}
      />
      <Input
        label="Medium (default)"
        size="medium"
        placeholder="Medium input"
        value={medium}
        onChangeText={setMedium}
      />
      <Input
        label="Large"
        size="large"
        placeholder="Large input"
        value={large}
        onChangeText={setLarge}
      />
    </View>
  );
};

export const InputVariants = () => {
  const [outlined, setOutlined] = useState('');
  const [filled, setFilled] = useState('');
  
  return (
    <View style={styles.container}>
      <Input
        label="Outlined (default)"
        variant="outlined"
        placeholder="Outlined input"
        value={outlined}
        onChangeText={setOutlined}
      />
      <Input
        label="Filled"
        variant="filled"
        placeholder="Filled input"
        value={filled}
        onChangeText={setFilled}
      />
    </View>
  );
};

export const InputStates = () => {
  const [normal, setNormal] = useState('');
  const [withError, setWithError] = useState('invalid-email');
  const [withHelper, setWithHelper] = useState('');
  
  return (
    <View style={styles.container}>
      <Input
        label="Normal"
        placeholder="Normal input"
        value={normal}
        onChangeText={setNormal}
      />
      <Input
        label="With Error"
        placeholder="Error input"
        value={withError}
        onChangeText={setWithError}
        error
        errorText="Email invalide"
      />
      <Input
        label="With Helper Text"
        placeholder="Helper input"
        value={withHelper}
        onChangeText={setWithHelper}
        helperText="Entrez votre nom complet"
      />
      <Input
        label="Disabled"
        placeholder="Disabled input"
        value="Cannot edit"
        disabled
      />
    </View>
  );
};

export const MultilineInput = () => {
  const [text, setText] = useState('');
  
  return (
    <Input
      label="Message"
      placeholder="Tapez votre message..."
      value={text}
      onChangeText={setText}
      multiline
      numberOfLines={4}
      helperText="Maximum 500 caractères"
    />
  );
};

export const FormExample = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  
  const updateField = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <View style={styles.form}>
      <Input
        label="Nom d'utilisateur"
        placeholder="johndoe123"
        value={formData.username}
        onChangeText={updateField('username')}
        leftIcon="person"
        required
        helperText="Minimum 3 caractères"
      />
      
      <Input
        label="Email"
        placeholder="votre@email.com"
        value={formData.email}
        onChangeText={updateField('email')}
        leftIcon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      
      <Input
        label="Mot de passe"
        placeholder="••••••••"
        value={formData.password}
        onChangeText={updateField('password')}
        leftIcon="lock-closed"
        secureTextEntry
        showPasswordToggle
        required
      />
      
      <Input
        label="Confirmer le mot de passe"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChangeText={updateField('confirmPassword')}
        leftIcon="lock-closed"
        secureTextEntry
        showPasswordToggle
        error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
        errorText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Les mots de passe ne correspondent pas' : undefined}
        required
      />
      
      <Input
        label="Bio"
        placeholder="Parlez-nous de vous..."
        value={formData.bio}
        onChangeText={updateField('bio')}
        multiline
        numberOfLines={3}
        helperText="Optionnel"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  form: {
    padding: 16,
    maxWidth: 400,
  },
});

// Export pour utilisation dans Storybook ou tests
export default {
  BasicInput,
  PasswordInput,
  InputWithIcons,
  InputSizes,
  InputVariants,
  InputStates,
  MultilineInput,
  FormExample,
};