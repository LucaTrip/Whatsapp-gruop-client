import { useContext, useEffect, useState } from "react";
import ChipButton from "./ChipButton";
import CustomInput from "./CustomInput";
import toast from "react-hot-toast";

import { PlusIcon } from "@heroicons/react/24/outline";
import { IFavouriteMember } from "../models/models";
import { ELocalStoragekeys } from "../models/types";
import { GlobalContext } from "../contexts/GlobalContext";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

function isPhoneValid(phone: string) {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
}

export default function Step2() {
  const [inputName, setInputName] = useState("");
  const [inputPhoneNumber, setInputPhoneNumber] = useState("");
  const [favouriteMembers, setFavouriteMembers] = useState<IFavouriteMember[]>(
    []
  );

  const { onAddFavouriteUsers } = useContext(GlobalContext);

  useEffect(() => {
    const _members = localStorage.getItem(ELocalStoragekeys.FAVOURITE_MEMBERS);

    if (_members) {
      setFavouriteMembers(JSON.parse(_members));
    }
  }, []);

  function saveCurrentMember() {
    if (!inputName.length && isPhoneValid(inputPhoneNumber)) {
      toast.error("Devi inserire un nome e un numero di telefono valido");
      return;
    }

    if (isPhoneValid(inputPhoneNumber)) {
      toast.error("Devi inserire un numero di telefono valido");
      return;
    }

    if (!inputName.length) {
      toast.error("Devi inserire un nome valido");
      return;
    }

    if (inputName.length && isPhoneValid(inputPhoneNumber)) {
      const _favourites = [
        ...favouriteMembers,
        { fullName: inputName, phoneNumber: `+${inputPhoneNumber}` },
      ];

      localStorage.setItem(
        ELocalStoragekeys.FAVOURITE_MEMBERS,
        JSON.stringify(_favourites)
      );

      onAddFavouriteUsers(_favourites);
      setFavouriteMembers(_favourites);
      toast.success("Utente aggiunto correttamente!");
      // reset values
      setInputName("");
      setInputPhoneNumber("+39");
    }
  }

  function onDeleteUser(userIndex: number) {
    const _favourites = favouriteMembers.filter(
      (_, index) => index !== userIndex
    );

    localStorage.setItem(
      ELocalStoragekeys.FAVOURITE_MEMBERS,
      JSON.stringify(_favourites)
    );

    setFavouriteMembers(_favourites);
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Aggiungi i numeri della tua organizzazione
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Qui potrai aggiungere i numeri di telefono che fanno parte della tua
          organizzazione e che saranno poi aggiunti automaticamente al gruppo
          Whatsapp. Una volta creato il gruppo questi contatti saranno salvati
          automaticamente.
        </p>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="mb-3">
            <label className="block font-semibold leading-6 text-gray-900">
              Numeri preferiti
            </label>
            <div className="flex flex-wrap mt-1 gap-3">
              {favouriteMembers.length ? (
                favouriteMembers.map((item, index) => (
                  <ChipButton
                    key={index}
                    user={item}
                    onHandleDelete={() => onDeleteUser(index)}
                  />
                ))
              ) : (
                <span>Nessun utente aggiunto ancora</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <CustomInput
                label="Nome completo"
                placeholder="Inserisci nome"
                inputValue={inputName}
                setInputValue={setInputName}
              />
            </div>
            <div className="sm:col-span-3">
              <CustomInput
                type="phone"
                label="Numero di telefono"
                inputValue={inputPhoneNumber}
                setInputValue={setInputPhoneNumber}
              />
            </div>

            <div className="sm:col-span-1 sm:flex sm:items-end sm:justify-end">
              <button
                type="button"
                onClick={saveCurrentMember}
                className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PlusIcon width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
