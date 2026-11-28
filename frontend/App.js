import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaScreen from './src/screens/ListaScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';
import FormularioScreen from './src/screens/FormularioScreen';
import SobreScreen from './src/screens/SobreScreen';
import { cores } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Lista"
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: cores.branco,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen
          name="Lista"
          component={ListaScreen}
          options={({ navigation }) => ({
            title: 'Círculo',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Sobre')}>
                <Text style={estilos.linkSobre}>Sobre</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Publicação' }} />
        <Stack.Screen
          name="Formulario"
          component={FormularioScreen}
          options={({ route }) => ({
            title: route.params?.publicacao ? 'Editar publicação' : 'Nova publicação',
          })}
        />
        <Stack.Screen name="Sobre" component={SobreScreen} options={{ title: 'Sobre' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  linkSobre: { color: cores.branco, fontWeight: '600', fontSize: 15 },
});
