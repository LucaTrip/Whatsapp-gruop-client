/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFavouriteMember, IKrossReservationUser } from "./models";

/* Types for GlobalContext */
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  AddFavouriteUsers = "ADD_FAVOURITE_USERS",
  AddSelectedGuest = "ADD_SELECTED_GUEST",
  OnSetSocketConnected = "ON_SET_SOCKET_CONNECTED",
  OnSetWaQrCode = "ON_SET_WA_QR_CODE",
  OnWaUserLogged = "ON_WA_USER_LOGGED",
}

export type StateType = {
  favouriteUsers: IFavouriteMember[];
  waQrCode: string;
  waUserLogged?: boolean;
  selectedGuest?: IKrossReservationUser;
};
/**************************/

export const ELocalStoragekeys = {
  FAVOURITE_MEMBERS: "FAVOURITE_MEMBERS",
} as const;

export const CONFIG = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
} as const;

export const SseType = {
  wa_ready: "wa_ready",
  wa_qrcode: "wa_qrcode",
  wa_authenticated: "wa_authenticated",
} as const;
