import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Header from './Header';


import { createPluginStore, PluginProvider,RendererPlugin } from "react-pluggable";
import ShowAlertPlugin from "./ShowAlertPlugin.tsx";

const pluginStore = createPluginStore();
pluginStore.install(new RendererPlugin());
pluginStore.install(new ShowAlertPlugin());

const Chat = () => {
    const [ connection, setConnection ] = useState(null);
    const [ chat, setChat ] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/hubs/chat')
            .withAutomaticReconnect()
            .build();
 
        setConnection(newConnection);
    }, []);
    /*
    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
    
                    connection.on('ReceiveMessage', message => {
                        console.log(message);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);
    */
   /*
    const sendMessage = async (user, message) => {
        const chatMessage = {
            user: user,
            message: message
        };

        if (connection.connectionStarted) {
            try {
                await connection.send('SendMessage');
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }
    */

    return (
        <div>
            <PluginProvider pluginStore={pluginStore}>
                <Header connection = {connection}/>
            </PluginProvider>
        </div>
    );
};

export default Chat;