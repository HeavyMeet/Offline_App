import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { global } from '../styles/globalStyles';

// Apollo 
import { gql, useMutation } from '@apollo/client';

const NUEVA_CUENTA = gql`
    mutation crearUsuario($input: UsuarioInput) {
        crearUsuario(input:$input)
    }
`;


const CrearCuenta =  () => {
    // State del formulario
    const [email, guardarEmail] = useState('');
    const [password, guardarPassword] = useState('');

    // React navigation
    const navigation = useNavigation();

    // Mutation de apollo
    const [ crearUsuario ] = useMutation(NUEVA_CUENTA);

    // Cuando el usuario presiona en crear cuenta
    const handleSubmit = async () => {
        // validar
        if(email === '' || password === '') {
            // Mostrar un error
            ToastAndroid.show('Todos los campos son obligatorios', ToastAndroid.SHORT);
            return;
        }

        try {
            const { data } = await crearUsuario({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            });

            ToastAndroid.show(data.crearUsuario, ToastAndroid.SHORT);
            navigation.navigate('Login');


        } catch (error) {
            ToastAndroid.show(error.message.replace('GraphQL error: ', ''), ToastAndroid.SHORT);
        }
    }

    return ( 
        <>
            <View style={global.contenido}>
            <TextInput    style={{
                        width: '90%',
                        padding: 2,
                        fontSize: 20
                        }}
                            placeholder="Colocar Email"
                            onChangeText={texto => guardarEmail(texto) }
                            value={email}
                        />
                        <TextInput  style={{
                        width: '90%',
                        padding: 2,
                        fontSize: 20
                        }}
                            secureTextEntry={true}
                            placeholder="Colocar Contraseña"
                            onChangeText={texto => guardarPassword(texto) }
                        />
               </View>
               <View style={global.contenido2}>
               
               <View style={global.butt}>
               <TouchableOpacity 
           onPress={()=> navigation.goBack()}
           style={global.button}>
               <Text style={global.buttonText}>{'Regresar'}</Text>
             </TouchableOpacity> 
               <TouchableOpacity 
           onPress={()=>handleSubmit()}
           style={global.button}>
               <Text style={global.buttonText}>{'Registrar Cuenta'}</Text>
             </TouchableOpacity>   
             </View>
            
            </View>
        </>
     );
}
 
export default CrearCuenta;