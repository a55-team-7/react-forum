import { createContext } from "react";

const AppContext = createContext({
    //some prop: 'some value'
    //someMethod: () => {}
    user: null,
    userData: null,
    setContext: () => {}
});

export default AppContext;