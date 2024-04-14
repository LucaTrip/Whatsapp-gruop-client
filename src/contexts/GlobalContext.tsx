import { ReactElement, createContext } from "react";
import { StateType } from "../models/types";
import { useGlobalContext } from "../hook/useGlobalContext";

const initState: StateType = {
  favouriteUsers: [],
  waQrCode: "",
  waUserLogged: undefined,
  selectedGuest: undefined,
};

type UseGlobalContextType = ReturnType<typeof useGlobalContext>;

const initContextState: UseGlobalContextType = {
  state: initState,
  onSelectedGuest: () => {},
  onAddFavouriteUsers: () => {},
};

export const GlobalContext =
  createContext<UseGlobalContextType>(initContextState);

type ChildrenType = {
  children?: ReactElement | ReactElement[] | undefined;
};

export const GlobalProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <GlobalContext.Provider value={useGlobalContext(initState)}>
      {children}
    </GlobalContext.Provider>
  );
};
