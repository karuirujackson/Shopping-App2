import { createContext, useCallback, useReducer } from 'react';

// Context helps share state across multiple components
export const ListsContext = createContext();
// useReducer takes in two parameters an initial state and a reducer function
const initialState = {
  lists: [],
  loading: true,
  error: ''
};

// Reducer function updates the initialState of the hook and returns current value based on the action sent to it.
// If action dispatched doe not match any of those defined in the reducer, the reducer just returns the current value without changes
const reducer = (state, action) => {
  switch (action.type) {
    case 'GET_LISTS_SUCCESS':
      return {
        ...state,
        lists: action.payload,
        loading: false,
      };
    case 'GET_LISTS_ERROR':
      return {
        ...state,
        lists: [],
        loading: false,
        error: action.payload
      }
    default:
      return state;
  }
}

export const ListsContextProvider = ({ children }) => {
  // useReducer takes an initiliazed state and a reducer function that determines which data should be returned
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // fetchLists() function calls the API and if there is a result, then,
  // 'GET_LISTS_SUCCESS' action is dispatched to the reducer using the dispatch function from the useReducer Hook.
  const fetchLists = useCallback(async() => { // useCallback() Hook prevents unneeded (re)renders of components unlike use a custom hook useDataFetching.
    try {
      const data = await fetch('https://my-json-server.typicode.com/PacktPublishing/React-Projects-Second-Edition/lists');
      const result = await data.json();

      if (result) {
        dispatch(
          {
            type: 'GET_LISTS_SUCCESS', 
            payload:result
          }
        );
      }
    } catch (e) {
      dispatch(
        {
          type: 'GET_LISTS_ERROR',
          payload: e.message
        }
      );
    }
  }, []);
      
  return (
    <ListsContext.Provider value={{...state, fetchLists}}>
        {children}
    </ListsContext.Provider>
  );
};

export default ListsContext;
