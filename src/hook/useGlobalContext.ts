import { useCallback, useEffect, useReducer } from "react";
import { ActionMap, CONFIG, SseType, StateType, Types } from "../models/types";
import { IFavouriteMember, IKrossReservationUser } from "../models/models";

type GlobalPayload = {
  [Types.AddFavouriteUsers]: IFavouriteMember[];
  [Types.AddSelectedGuest]: IKrossReservationUser;
  [Types.OnSetWaQrCode]: string;
  [Types.OnWaUserLogged]: boolean;
};

type ReducerAction = ActionMap<GlobalPayload>[keyof ActionMap<GlobalPayload>];

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case Types.AddFavouriteUsers:
      return {
        ...state,
        favouriteUsers: action.payload,
      };

    case Types.AddSelectedGuest:
      return { ...state, selectedGuest: action.payload };

    case Types.OnSetWaQrCode:
      return { ...state, waQrCode: action.payload };

    case Types.OnWaUserLogged:
      return { ...state, waUserLogged: action.payload };

    default:
      throw new Error();
  }
};

export function useGlobalContext(initState: StateType) {
  const [state, dispatch] = useReducer(reducer, initState);

  const onAddFavouriteUsers = useCallback(
    (usersList: IFavouriteMember[]) =>
      dispatch({
        type: Types.AddFavouriteUsers,
        payload: usersList,
      }),
    []
  );

  const onSelectedGuest = useCallback(
    (guest: IKrossReservationUser) =>
      dispatch({ type: Types.AddSelectedGuest, payload: guest }),
    []
  );

  const onSetWaQrCode = useCallback(
    (qrcode: string) =>
      dispatch({ type: Types.OnSetWaQrCode, payload: qrcode }),
    []
  );

  const onWaUserLogged = useCallback(
    (status: boolean) =>
      dispatch({ type: Types.OnWaUserLogged, payload: status }),
    []
  );

  useEffect(() => {
    const source = new EventSource(`${CONFIG.BACKEND_URL}/sse-wa`);

    source.onmessage = (event) => {
      console.log("onmessage - wa", event);
      try {
        const data = JSON.parse(event.data);

        console.log("parsed data", data);

        if (data.type === SseType.wa_qrcode) {
          onSetWaQrCode(data.data);
        } else if (data.type === SseType.wa_authenticated) {
          onWaUserLogged(data.data);
        }
      } catch (error) {
        console.log("wa event error", error);
      }
    };

    return () => {
      source.close();
    };
  }, [onSetWaQrCode, onWaUserLogged]);

  return {
    state,
    onSelectedGuest,
    onAddFavouriteUsers,
  };
}
