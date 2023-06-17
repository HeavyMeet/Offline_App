import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from "apollo-upload-client";
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getApolloClient = async () => {

    const cache = new InMemoryCache();

    const authLink = setContext(async (_, { headers }) => {
        // Leer el token
        const token = await AsyncStorage.getItem('token');

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        }
    })

    // uri:'http://192.168.1.67:4000/graphql',
    // uri: 'https://servermongo-9ram.onrender.com'
    const serverLink = createUploadLink({
        uri: 'http://192.168.1.67:4000/graphql', 
        //All users of graphql-upload should enable csrfPrevention and configure their upload clients to send 
        //a non-empty Apollo-Require-Preflight header.
        headers: {
            'Apollo-Require-Preflight': 'true'
        }
    });
    const link = authLink.concat(serverLink);

    // await persistCache({
    //     cache,
    //     storage: new AsyncStorageWrapper(AsyncStorage)
    // });

    return new ApolloClient({ cache, link });
};



