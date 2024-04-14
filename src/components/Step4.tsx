import { useContext, useEffect, useState } from "react";
import CustomInput from "./CustomInput";
import { GlobalContext } from "../contexts/GlobalContext";
import { IFavouriteMember, IKrossReservationUser } from "../models/models";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CONFIG } from "../models/types";
import Modal from "./Modal";
import { Player } from "@lottiefiles/react-lottie-player";
import GeneralLoading from "../assets/lotties/loading.json";

interface IUser {
  fullName: string;
  phoneNumber: string;
}

interface ICreateWhatsAppGroup {
  groupName: string;
  guestInfo: IKrossReservationUser;
  adminList: IUser[];
}

export default function Step4() {
  const [inputName, setInputName] = useState("");

  const {
    state: { favouriteUsers, selectedGuest, waUserLogged },
  } = useContext(GlobalContext);

  const { mutate, isError, isSuccess, isPending } = useMutation({
    mutationFn: (body: ICreateWhatsAppGroup) =>
      axios.post(`${CONFIG.BACKEND_URL}/create-wa-group`, body),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Gruppo WhatsApp creato correttamente!");
    }

    if (isError) {
      toast.error("Errore durante la creazione del gruppo.");
    }
  }, [isSuccess, isError]);

  function onCreateWaGroup(
    groupName: string,
    favouriteUsers: IFavouriteMember[],
    selectedGuest?: IKrossReservationUser
  ) {
    if (!waUserLogged && !selectedGuest) {
      toast.error("Prima devi completare tutti gli step richiesti!");
      return;
    }

    if (!waUserLogged) {
      toast.error(
        "Devi prima autenticarti tramite WhatsApp scannerizzando il Qr Code!"
      );
      return;
    }

    if (!selectedGuest) {
      toast.error("Seleziona un ospite per poter creare un gruppo con lui");
      return;
    }

    if (!groupName.length) {
      toast.error("Inserisci un nome di un gruppo valido!");
      return;
    }

    mutate({
      groupName,
      adminList: favouriteUsers,
      guestInfo: selectedGuest,
    });
  }

  return (
    <>
      <Modal show={isPending} backdropDismiss={false}>
        <div className="flex flex-col items-center text-center">
          <Player autoplay loop src={GeneralLoading}></Player>
          <div>
            <span className="font-bold text-lg">
              Creando il gruppo WhatsApp...
            </span>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Crea Gruppo
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Qui dovrai inserire il nome del gruppo Whatsapp e infine potrai
            crearlo con il bottone <span className="italic">Crea Gruppo</span>
            . <br />
            In automatico verra creato un gruppo con il nome e i contatti
            selezionati.
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <CustomInput
                  label="Nome gruppo"
                  placeholder="Inserisci nome"
                  inputValue={inputName}
                  setInputValue={setInputName}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => {
                onCreateWaGroup(inputName, favouriteUsers, selectedGuest);
              }}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Crea Gruppo
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
