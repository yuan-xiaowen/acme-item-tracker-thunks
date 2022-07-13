import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import axios from 'axios';

// const initialState = {
//   view: window.location.hash.slice(1),
//   users: [],
//   things: []
// };

const viewReducer = (viewState =window.location.hash.slice(1), action)=> { 
  if(action.type === 'SET_VIEW'){
    return action.view;
  }
  return viewState;
};

const usersReducer = (usersState = [], action)=> { 
  if(action.type === 'DELETE_USER'){
    return usersState.filter(user => user.id !== action.user.id )
  }
  if(action.type === 'SET_USERS'){
    return action.users;
  }
  if(action.type === 'CREATE_USER'){
    return [...usersState, action.user ]; 
  }
  if(action.type === 'UPDATE_USER'){
    return  usersState.map(user => user.id !== action.user.id ? user : action.user)
  }
  return usersState;
};

const updateUser = (user)=>{
  return async(dispatch)=> {
    user = (await axios.put(`/api/users/${user.id}`, user)).data;
    dispatch({ type: 'UPDATE_USER', user });
  };
}

const createUser=()=>{
  return async(dispatch)=> {
    const user = (await axios.post('/api/users', {name: Math.random()})).data;
    dispatch({ type: 'CREATE_USER', user});
  }
}

const removeThingFromUser = (thing)=>{
  return async(dispatch)=> {
    const updatedThing = (await axios.put(`/api/things/${thing.id}`, thing)).data
    dispatch({ type: 'UPDATE_THING', thing: updatedThing});
  }
}

const deleteUser = (user)=>{
  return async(dispatch)=> {
    await axios.delete(`/api/users/${user.id}`);
    dispatch({ type: 'DELETE_USER', user});
  }
}

const thingsReducer = (thingsState = [], action)=> { 
  if(action.type === 'DELETE_THING'){
    return thingsState.filter(thing => thing.id !== action.thing.id);
  }
  if(action.type === 'UPDATE_THING'){
    return thingsState.map(thing => thing.id !== action.thing.id ? thing : action.thing);
  }
  if(action.type === 'SET_THINGS'){
    return action.things;
  }
  if(action.type === 'CREATE_THING'){
    return [...thingsState, action.thing ]; 
  }
  return thingsState;
};

const createThing = ()=>{
  return async(dispatch)=> {
    const response = await axios.post('/api/things', { name: Math.random()});
    const thing = response.data;
    dispatch({ type: 'CREATE_THING', thing });
  }
}

const updateThing = (thing)=> {
  return async(dispatch)=> {
    thing = (await axios.put(`/api/things/${thing.id}`, thing)).data;
    dispatch({ type: 'UPDATE_THING', thing });
  };
};
const deleteThing = (thing)=> {
  return async(dispatch)=> {
    await axios.delete(`/api/things/${thing.id}`);
    dispatch({ type: 'DELETE_THING', thing });
  };
};

const loadData = ()=>{
  return async(dispatch)=> {
    const responses = await Promise.all([
      axios.get('/api/users'),
      axios.get('/api/things'),
    ]);
    dispatch({
      type: 'SET_USERS',
      users: responses[0].data
    });
    dispatch({
      type: 'SET_THINGS',
      things: responses[1].data
    });
  }
}

const reducer = combineReducers({
  users: usersReducer,
  things: thingsReducer,
  view: viewReducer
});

const store = createStore(reducer, applyMiddleware(logger, thunk));



export { deleteThing, updateThing, createUser, removeThingFromUser, deleteUser, createThing, loadData,updateUser };

export default store;

