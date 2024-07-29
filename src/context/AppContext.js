import { ItemsContextProvider } from "./ItemsContext"
import { ListsContextProvider } from "./ListsContext"

const AppContext = ({ children }) => {
    return (
        <ListsContextProvider>
            <ItemsContextProvider>
                {children}
            </ItemsContextProvider>
        </ListsContextProvider>
    )
}

export default AppContext;