import { createContext, useState } from 'react';

export const BusquedaContext = createContext();

export const BusquedaProvider = ({ children }) => {
  const [textoBusqueda, setTextoBusqueda] = useState('');

  return (
    <BusquedaContext.Provider value={{ textoBusqueda, setTextoBusqueda }}>
      {children}
    </BusquedaContext.Provider>
  );
};