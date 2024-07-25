import React, { createContext, useCallback, useReducer } from 'react'

// Context helps share state across multiple components
export const ItemsContext = createContext();

// useReducer takes in two parameters an initial state and a reducer function
const initialState = {
  items: [],
  loading: true,
  error: ''
};

// Reducer function updates the initialState of the hook and returns current value based on the action sent to it.
// If action dispatched doe not match any of those defined in the reducer, the reducer just returns the current value without changes
const reducer = (state, action) => {
  switch (action.type) {
    case 'GET_ITEMS_SUCCESS':
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case 'GET_ITEMS_ERROR':
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
export const ItemsContextProvider = ({ children }) => {
  // useReducer takes an initiliazed state and a reducer function that determines which data should be returned
  const [state, dispatch] = useReducer(reducer, initialState);

  // fetchLists() function calls the API and if there is a result, then,
  // 'GET_LISTS_SUCCESS' action is dispatched to the reducer using the dispatch function from the useReducer Hook.
  const fetchItems = useCallback(async (listId) => { // useCallback() Hook prevents unneeded (re)renders of components unlike use a custom hook useDataFetching.
    try {
      const data = await fetch(`https://my-json-server.typicode.com/PacktPublishing/React-Projects-Second-Edition/lists/${listId}/items`);
      const result = await data.json();

      if (result) {
        dispatch(
          {
            type: 'GET_ITEMS_SUCCESS',
            payload: result
          }
        );
      }
    } catch (e) {
      dispatch(
        {
          type: 'GET_ITEMS_ERROR',
          error: e.message
        }
      );
    }
  }, []);

  return (
    <ItemsContext.Provider value={{...state, fetchItems}}>
        {children}
    </ItemsContext.Provider>
  )
}

export default ItemsContext;
