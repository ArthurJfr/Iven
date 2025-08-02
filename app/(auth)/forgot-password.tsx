import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return;
    }
    
    Alert.alert('Email envoyé', 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe');
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
        Mot de passe oublié
      </Text>
      <Text style={{ color: '#666', marginBottom: 32, textAlign: 'center' }}>
        Entrez votre email pour recevoir un lien de réinitialisation
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <Button
        title="Envoyer le lien"
        onPress={handleSubmit}
        style={{ marginBottom: 16 }}
      />

      <Button
        title="Retour à la connexion"
        onPress={() => router.back()}
        variant="secondary"
      />
    </View>
  );
} 