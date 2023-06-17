import React, { useState, useEffect } from "react";
import { Image, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuProvider from './context/MenuProvider';
import Login from './screens/Login';
import CrearCuenta from './screens/CrearCuenta';
import Info from './screens/Info';
import Curp from './screens/Curp';
import Menu from './screens/Menu';
import Camera from './screens/Camera';
import SubirDatos from './screens/SubirDatos';
import Imagenes from './screens/Imagenes';
import { getApolloClient} from './config/apollo';
import {ApolloProvider} from '@apollo/client';

const Stack = createStackNavigator();
function MyStack() {
  return (
    <NavigationContainer>
        <MenuProvider>
        <StatusBar backgroundColor="#4f4e4e" barStyle="light-content"/>
        <Stack.Navigator
          screenOptions={{
            headerStyle:{
             backgroundColor:'#efefef'        
            },
          //   headerLeft: ()=>
          //   <Image
          //     style={{left:10, bottom:2, height:90, width:80}}
          //     source={require('./assets/images/gobmex1.png')}
          //     resizeMode='contain'
          //   />,
          //   headerRight: ()=> <Image
          //   style={{height:100, width:100}}
          //   source={require('./assets/images/edomex1.png')}
          //   resizeMode='contain' 
          // />,
            headerTitleStyle: {
              color: 'transparent',
            }
         }
        }
        >
          <Stack.Screen name="Login" component={Login}/> 
          <Stack.Screen name="CrearCuenta" component={CrearCuenta}/> 
          <Stack.Screen name="Info" component={Info}/>
          <Stack.Screen name="Curp" component={Curp}/>    
         <Stack.Screen name="Menu" component={Menu}/> 
         <Stack.Screen options={{headerShown:false}}
          name="Camera" component={Camera}/>    
        <Stack.Screen name="SubirDatos" component={SubirDatos}/>     
        <Stack.Screen name="Imagenes" component={Imagenes}/> 
      </Stack.Navigator>
      </MenuProvider>
      </NavigationContainer>
  );
}

export default function App() {
  const [client, setClient] = useState(undefined);
  
  const initializeApolloClient = async () => {
        await getApolloClient().then((apolloClient) => {
          setClient(apolloClient);
        });
  };

  useEffect(() => {
    initializeApolloClient();
  }, []);

   if (client === undefined) return <Text>Cargando...</Text>;
  
  // console.log(client.cache.data, " mostrar cache ")
   return (
     <ApolloProvider client={client}>
         <MyStack/>
     </ApolloProvider>
   );
}



