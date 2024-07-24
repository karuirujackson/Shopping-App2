import React, { createContext } from 'react';
import useDataFetching from '../hooks/useDataFetching';

export const ItemsContext = createContext();
export const ItemsContextProvider = ({ children }) => {
    const {loading, error, data} = useDataFetching('https://my-json-server.typicode.com/PacktPublishing/React-Projects-Second-Edition/items');
  return (
    <ItemsContext.Provider value={{items: data, loading, error}}>
        {children}
    </ItemsContext.Provider>
  )
}

export default ItemsContext;
