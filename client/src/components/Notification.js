import React,{useState,useEffect} from 'react';
import './Notification.css';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import { Box } from "@material-ui/core"
import Sort from "./SortFilter"
import { IconButton, Button } from "@material-ui/core"
import faker from "faker"
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';

function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      //border: '2px solid #4682B4',
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const useStylesSearch = makeStyles((theme) => ({
    root: {
      '& > *': {
          width:'90%'
      },
    },
  }));

const Notification = ({  connection }) => {

    const [open, setOpen] = React.useState(false)
    var [alerts,setAlerts] = useState([]);
    var [allAlerts,setAllAlerts] = useState([]);
    var [modelUi,setModelui] = useState();
    var [filterState,setFilterState] = useState('all');
    var [displaySearch,setSearchDisplay] = useState(false);
    const [ModelOpen, setModelOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [sortSettings, setSortSortSettings] = React.useState({
        filters: [1, 2, 3, 4],
        sort: 0
    })

    async function updateState(stateMethod){
        setFilterState(stateMethod);
        send(stateMethod);
    }
    useEffect(() => {
        if (connection) {
            if(connection.connectionStarted){
                send(filterState);
                connection.on('ReceiveMessage', message => {
                    setAlerts(message);
                    setAllAlerts(message);
                    deleverAll(message);
                });
            }
            else
                connection.start()
                    .then(result => {
                        send(filterState);
                        console.log('Connected!');
        
                        connection.on('ReceiveMessage', message => {
                            setAlerts(message);
                            setAllAlerts(message);
                            deleverAll(message);
                        });
                    })
                    .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    useEffect(() => {
        if (connection) {
            if(connection.connectionStarted){
                connection.on('NewMessage', message => {
                    //var check = [...alerts1, ...[message]]
                    //setAlerts(check);
                    send(filterState);

                });
            }
            else
                connection.start()
                    .then(result => {
                        console.log('Connected!');
        
                        connection.on('NewMessage', message => {
                            //var check = [...alerts1, ...[message]]
                            //setAlerts(check);
                            send(filterState);
                        });
                    })
                    .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    async function send(stateMethod){
        if (connection.connectionStarted) {
            try {
                await connection.invoke('SendMessage',stateMethod);
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }

    function getTime(datetime){
        var date1 = new Date(datetime);
        var date2 = new Date();  
        var time_difference = date2.getTime() - date1.getTime();   
        var days_difference = Math.floor(time_difference / (1000 * 60 * 60 * 24));  
        var hrs_difference = Math.floor(time_difference / (1000 * 60 * 60)) - 5;
        var mins_difference = Math.floor(time_difference / (1000 * 60)) - 330;

        if(days_difference>0){
            return days_difference.toString() +" days ago";
        }
        else{
            if(hrs_difference<1) 
            {

                if(mins_difference>=1) return mins_difference.toString() +" minutes ago";
                else return "Just now";
            }
            return hrs_difference.toString() +" hours ago";
        }
    }
    function getCategory(category){
        var field = '';
        switch(category){
            case 1: field = "Forecast"; break;
            case 2: field = "Inventory"; break;
            case 3: field = "Order";break;
            case 4: field = "Anouncements"; break;
            default: field="Unknown";break;
        }
        return(
            <div className={field}>{field}</div>
        )
    }
    function para(text){
        if(text.length>100){
            return(
                <span>{text.substring(0,100)} ...</span>
            )
        }
        else{
            return(
                <span>{text}</span>
            )
        }
    }
    function getUnreadcnt()
    {
        ;
    }

    
    async function updateUnread(id){
        if (connection.connectionStarted) {
            try {
                    await connection.invoke('PerformAction',[id],"unread");
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }
    async function deleteAlert(id){
        if (connection.connectionStarted) {
            try {
                    await connection.invoke('PerformAction',[id],"delete");
                    handleClose();
                    send(filterState);
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }
    const classes = useStyles();
    const serachClasses = useStylesSearch();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    function getModelUi(){
        if(modelUi){
            return(
            <div style={modalStyle} className={classes.paper}>
                <div className="headerLine">
                    <h2 id="simple-modal-title">{modelUi.title}</h2>
                </div>
                <p id="simple-modal-description">
                    {modelUi.body}
                </p>
                <div className="modelBelow">
                    <div>{getCategory(modelUi.category)}</div>
                    <span>Added {getTime(modelUi.addedOn)}</span>
                </div>
                <div className="modelFooter">
                <Button onClick={()=> updateUnread(modelUi.notification_id)} color="primary" >
                    Mark as Unread
                </Button>
                <Button onClick={()=> deleteAlert(modelUi.notification_id)} color="primary" >
                    Delete
                </Button>
                </div>
            </div>
            )
        }
        else
            return(<span></span>);
    }

    async function clearAll(){

        let ids = [];
        alerts.forEach(element => {
            ids.push(element.notification_id);
        });

        if (connection.connectionStarted) {
            try {
                if(ids.length>0)
                    await connection.invoke('PerformAction',ids,"delete");
                send(filterState);
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }

    async function deleverAll(message){
        let ids = [];
        message.forEach(element => {
            ids.push(element.notification_id);
        });
        if (connection.connectionStarted) {
            try {
                if(ids.length>0)
                    await connection.invoke('PerformAction',ids,"deliver");
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }
    async function popUp(alertData){
        if (connection.connectionStarted) {
            try {
                await connection.invoke('PerformAction',[alertData.notification_id],"read");
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
        setModelui(alertData);
        setModelOpen(true)
    }
    const handleClose = () => {
        setModelOpen(false);
    };
    function searchTextBased(){
        var newArr = allAlerts.filter(alert => alert.title.toLowerCase().includes(value.toLowerCase()) || alert.body.toLowerCase().includes(value.toLowerCase()));
        setAlerts(newArr);
    }
    const editSearch = (event) => {
        setValue(event.target.value);
    }
    const filteredAlerts = alerts.filter((a) => sortSettings.filters.includes(a.category))
    const sortedAlerts = sortSettings.sort === 1 ? filteredAlerts.reverse() : filteredAlerts


        return (
            <>
                <Sort open={open} onClose={() => setOpen(false)} settings={sortSettings}
                    setSortSettings={setSortSortSettings} />
                <Modal
                    open={ModelOpen}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {getModelUi()}
                </Modal>
                <div className="notificationComponent">
                    <header className="header">Notifications</header>
                    <div className="notificationMenu">
                        <span className={filterState=="all" ? "active" : "nrml"} onClick={()=> updateState('all')}>All</span>
                        <span  className={filterState=="unread" ? "active" : "nrml"} onClick={()=> updateState('unread')}>Unread</span>
                        <span className={filterState=="anouncements" ? "active" : "nrml"} onClick={()=> updateState('anouncements')}>Anouncements</span>
                        <div>
                            <Box mt={1} >
                                <Box p={0.5} >
                                    {/* <IconButton onClick={() => setOpen(true)}> */}
                                    <div onClick={() => setSearchDisplay(!displaySearch)}>
                                        <SearchIcon />
                                    </div>
                                    {/* </IconButton> */}
                                </Box>
                                <Box p={0.5} >
                                    {/* <IconButton onClick={() => setOpen(true)}> */}
                                    <div onClick={() => setOpen(true)}>
                                        <FilterListIcon />
                                    </div>
                                    {/* </IconButton> */}
                                </Box>
                                
                                {/* <Box p={0.5}>
                                    <SearchIcon />
                                </Box> */}
                            </Box>
                        </div>
                    </div>
                    <div className={"searchMenu " + (displaySearch ? "displaySearch" : "hideSearch")}>
                        <Input className="searchClass"
                            id="input-with-icon-adornment" placeholder="search here" onChange={editSearch}
                            endAdornment={
                                <InputAdornment position="start">
                                   <IconButton onClick={()=> searchTextBased()} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        </div>
                    <div className="notificationList wrapper">
                        {sortedAlerts.map(alert => (
                            <div key = {alert.notification_id}className={"notificationItem " + (alert.readyn == 0 ? "highlight" : "nrml")} >
                                <div className="headerLine" onClick={()=> popUp(alert)}>
                                    <p className="title">{alert.title}</p>
                                    
                                    <p className="body">{para(alert.body)}</p>
                                </div>
                                <div className="footer">
                                    {getCategory(alert.category)}
                                    <span>{getTime(alert.addedOn)} <strong><a className="delbutton" onClick={()=> deleteAlert(alert.notification_id)} color="primary" >[X] </a> </strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="clearAll" onClick={()=>clearAll()}>Clear all</p> 
                </div>
            </>
        )

}

export default Notification;