import { useState, useEffect } from 'react';
import { global } from '../styles/globalStyles';
import { gql, useMutation } from '@apollo/client';
import { Text, TextInput, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { botonesEncabezado } from '../config/botonesEncabezado';
import { useNetInfo } from "@react-native-community/netinfo";

const AUTENTICAR_USUARIO = gql`
    mutation AutenticarUsuario($input: UsuarioInput) {
    autenticarUsuario(input: $input) {
        token
    }
}
`;

const Login = () => {
    const navigation = useNavigation();
    const [email, guardarEmail] = useState("");
    const [password, guardarPassword] = useState("");
    const [token, setToken] = useState(null);
    // Mutation de apollo
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
    const { isConnected } = useNetInfo();

    useEffect(() => {
        const getToken = async () => {
            try {
                setToken(await AsyncStorage.getItem('token'));
                if(isConnected !== null){
                if (token !== null) {
                    botonesEncabezado(navigation, CommonActions, isConnected);
                }else{
                    botonesEncabezado(navigation, CommonActions, isConnected, 1);
                }
              }
            } catch (e) {
                ToastAndroid.show(e, ToastAndroid.SHORT);
            }
        }
        getToken();
    }, [token, isConnected]);

    const handleSubmit = async () => {

        if (email === "" || password === "") {
            // Mostrar un error
            ToastAndroid.show('Todos los campos son obligatorios', ToastAndroid.SHORT);
            return;
        }
        try {

            const { data } = await autenticarUsuario({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            });
            const { token } = data.autenticarUsuario;
            // Colocar token en storage
            await AsyncStorage.setItem('token', token);

            // Redireccionar a Proyectos
            navigation.navigate("Curp");
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);

        }
    }

    return (
        <>
            {token === null ? (
                <>
                    <View style={global.contenido}>
                        <TextInput style={{
                            width: '90%',
                            padding: 2,
                            fontSize: 20
                        }}
                            placeholder="Colocar Email"
                            onChangeText={texto => guardarEmail(texto)}
                            value={email}
                        />
                        <TextInput style={{
                            width: '90%',
                            padding: 2,
                            fontSize: 20
                        }}
                            secureTextEntry={true}
                            placeholder="Colocar Contraseña"
                            onChangeText={texto => guardarPassword(texto)}
                        />
                    </View>
                    <View style={global.contenido2}>
                        <View style={global.butt}>
                            <TouchableOpacity
                                onPress={() => handleSubmit()}
                                style={global.button}>
                                <Text style={global.buttonText}>{'Iniciar Sesión'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("CrearCuenta")}
                                style={global.button}>
                                <Text style={global.buttonText}>{'Registrarse'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <View style={global.contenido2}></View>
                    <View style={[global.butt, { flex: 0.3, backgroundColor: 'steelblue' }]}>
                        <Text style={{ color: 'white', fontSize: 31, fontWeight: 'bold', margin: 10 }}>{'SESIÓN ABIERTA'}</Text>
                    </View>
                    <View style={[global.butt, { alignItems: 'flex-start' }]}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Curp")}
                            style={[global.button, { height: 50 }]}>
                            <Text style={[global.buttonText, { fontSize: 23 }]}>{'Continuar'}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </>
    );
}
export default Login; 