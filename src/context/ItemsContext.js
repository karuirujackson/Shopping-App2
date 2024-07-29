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
      // Adds a new action to the reducer hook which is dispatched once we try adding a new item.
    case 'ADD_ITEM_SUCCESS':
      return {
        ...state,
        items: [...state.items, action.payload],
        loading: false
      };
    default:
      return state;
  }
};
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

  // Add a new function that can handle POST requests, as this function should also set the method and a body when handling the fetch request.
  const addItem = useCallback(async ({ listId, title, quantity, price }) => {
    const itemId = Math.floor(Math.random() * 100);
    try {
      const data = await fetch(`https://my-json-server.typicode.com/PacktPublishing/React-Projects-Second-Edition/items`,
        {
          method: 'POST',
          body: JSON.stringify(
            {
              id: itemId, listId, title, quantity, price
            }
          ),
        },
      );
      const result = await data.json();

      if (result) {
        dispatch(
          {
            type: 'ADD_ITEM_SUCCESS',
            payload: {
              id: itemId, listId, title, quantity, price
            },
          }
        );
      }
    } catch {
      
    }
  }, []);

  return (
    <ItemsContext.Provider value={{ ...state, fetchItems, addItem }}>
        {children}
    </ItemsContext.Provider>
  )
}

export default ItemsContext;
