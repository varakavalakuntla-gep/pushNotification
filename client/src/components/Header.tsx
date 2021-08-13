import React, { useState , useEffect} from "react";
import { usePluginStore } from "react-pluggable";
import Notification from "./Notification";
import './Notification.css';
import '../App.css';
import { SetStateAction } from "react";
import NotificationsIcon from '@material-ui/icons/Notifications';
import { IconButton, Box } from "@material-ui/core"

const Header = (props: any) => {
  const pluginStore: any = usePluginStore();
  let Renderer = pluginStore.executeFunction("Renderer.getRendererComponent");

  const [newAlert, setNewAlert] = useState(0);
  const [isDisplay, setDisplay] = useState(false);

  const [unreadcnt, setUnreadcnt] = useState(0);

  const [initial, setInitial] = useState(true);



  useEffect(() => {

    console.log(props);
    if (props.connection) {
        if(props.connection.connectionStarted){
          alertNew();
            props.connection.on('Alert', (message: any) => {
              setNewAlert(1);
              setUnreadcnt(message);
            });
        }
        else
            props.connection.start()
                .then((result: any) => {
                  alertNew();
                    console.log('Connected!');
    
                    props.connection.on('Alert', (message: any) => {
                      setNewAlert(1);
                      setUnreadcnt(message);
                    });
                })
                .catch((e: any) => console.log('Connection failed: ', e));
    }
  }, [props.connection]);

  const unreadfunc = async()=>{
          await props.connection.invoke('GetUnread');
  }
  
// if(initial) {getUnread(); setInitial(false);}

  const alertNew = async()=>{
    if (props.connection.connectionStarted) {
      try {
          await props.connection.send('SendAlert');
      }
      catch(e) {
          console.log(e);
      }
    }
    else {
        alert('No connection to server yet.');
    }
  }

  var toggleNotification = function () {
    setDisplay(!isDisplay);
    if(!isDisplay){
      pluginStore.executeFunction("Renderer.add", "notification",()=>{
        console.log(props.connection);
        return(
          <Notification connection={props.connection}/>
          )
          
      })
    }
    else{
      if(newAlert){
        setNewAlert(0)
      }
      pluginStore.executeFunction("Renderer.remove", "notification",()=>{
      })
    }
  }

  return (
    
    <div>
      <div className="homeHeader">
      <div className='headerLeft'>
        <div className="iconText"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list menu" viewBox="0 0 16 16">
            <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
          </div> 
          
          <p>Welcome</p>
        </div>
        <div className="iconwText">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className={"bi bi-bell-fill notifiIcon "+ (newAlert == 1 ? "newColor" : "nrmlColor") } viewBox="0 0 16 16" onClick={() => toggleNotification()}>
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
          </svg>
          <p>{unreadcnt}</p>
        </div>
        
      </div>
      <Renderer placement="notification" />
    </div>
  );
};

export default Header;