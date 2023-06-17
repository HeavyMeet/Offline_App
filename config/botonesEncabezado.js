import { Text, TouchableOpacity, Alert, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { global } from '../styles/globalStyles';

export const botonesEncabezado = (navigation, CommonActions, isConnected, val) => {

   try {
      navigation.setOptions({
         headerRight: ()=> (
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Info', val)}
                    style={global.button}>
                    <Text style={global.buttonText}>{'Info'}</Text>
                </TouchableOpacity>
               { val !== 1 && <TouchableOpacity
                    onPress={() => checkInternet()}
                    style={global.button}>
                    <Text style={global.buttonText}>{'Salir'}</Text>
                </TouchableOpacity> }
            </View>
        )})
      

      const checkInternet = () => {

         if (isConnected === false) {

            Alert.alert('Sin conexión a Internet', 'Se encuentra sin conexión, no podrá iniciar sesión de nuevo hasta que '
               + 'vuelva tener conexión a Internet ¿Esta seguro de cerrar la sesión?', [
               {
                  text: 'Cancelar',
                  style: 'cancel',
               },
               { text: 'Sí', onPress: () => LogoutF() },
            ]);
         } else {
            LogoutF();
         }
      }

      const LogoutF = async () => {
         try {
            await AsyncStorage.clear();
            navigation.dispatch(CommonActions.reset({
               index: 1,
               routes: [{ name: 'Login' }]
            }))
         } catch (e) {
            ToastAndroid.show(e, ToastAndroid.SHORT);
         }
      }

   } catch (e) {
      ToastAndroid.show(e, ToastAndroid.SHORT);
   }
}







