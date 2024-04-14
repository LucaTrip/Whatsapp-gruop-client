import { useContext, useEffect, useState } from "react";
import { IKrossReservationUser, Room } from "../models/models";
import KrossChipButton from "./KrossChipButton";
import { GlobalContext } from "../contexts/GlobalContext";
import Modal from "./Modal";
import RoomRadioListGroup from "./RoomRadioListGroup";
import { getTheDateBefore } from "../utils/utils";
import { CONFIG } from "../models/types";

export default function Step3() {
  const yesterday = getTheDateBefore();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    yesterday.toLocaleDateString().split("/").reverse().join("-")
  );
  const [krossResponseStatus, setKrossResponseStatus] = useState<{
    isLoading: boolean;
    isError: boolean;
    data: IKrossReservationUser[] | undefined;
  }>({
    isLoading: false,
    isError: false,
    data: undefined,
  });

  const { onSelectedGuest } = useContext(GlobalContext);

  useEffect(() => {
    const source = new EventSource(
      `${CONFIG.BACKEND_URL}/sse-kross?date=${selectedDate}`
    );

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data).data;
        setKrossResponseStatus({
          isError: false,
          isLoading: false,
          data,
        });
      } catch (error) {
        setKrossResponseStatus({
          data: undefined,
          isError: true,
          isLoading: false,
        });
      }
    };

    source.onerror = (event) => {
      console.log("error", event);
      setKrossResponseStatus({
        data: undefined,
        isError: true,
        isLoading: false,
      });
    };

    return () => {
      source.close();
    };
  }, [selectedDate]);

  function onUserSelected(userIndex: number) {
    if (krossResponseStatus.data) {
      setKrossResponseStatus((prevVal) => ({
        ...prevVal,
        data: prevVal?.data?.map((guest, index) => {
          if (userIndex === index) {
            guest.is_selected = true;
          } else {
            guest.is_selected = false;
          }
          return guest;
        }),
      }));

      setRooms(krossResponseStatus.data[userIndex].rooms);
    }
  }

  function onRoomSelected(room: Room) {
    if (krossResponseStatus.data) {
      const selectedGuest = krossResponseStatus.data.find(
        (guest) => guest.is_selected
      );
      if (selectedGuest) onSelectedGuest({ ...selectedGuest, rooms: [room] });
    }
  }

  return (
    <>
      <Modal show={Boolean(rooms.length)} backdropDismiss={false}>
        <RoomRadioListGroup
          rooms={rooms}
          onConfirm={() => setRooms([])}
          onRoomIndexSelected={onRoomSelected}
        />
      </Modal>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Informazioni Ospite
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Qui potrai selezionare un ospite, da inserire sul gruppo,
            semplicemente cliccando su di esso. Una volta fatto potrai passare
            alla fase di creazione gruppo Whatsapp.
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="flex items-center justify-between gap-x-4">
              <span className="block font-semibold leading-6 text-gray-900">
                Utenti confermati il:
              </span>
              <input
                type="date"
                name="start-date"
                className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-wrap mt-1 gap-3">
              {krossResponseStatus.isLoading ? (
                <span>Caricando...</span>
              ) : krossResponseStatus.isError ? (
                <span>Qualcosa è andato storto :(</span>
              ) : krossResponseStatus.data?.length ? (
                krossResponseStatus.data.map((item, index) => (
                  <KrossChipButton
                    key={item.id_reservation}
                    user={item}
                    onUserSelected={() => onUserSelected(index)}
                  />
                ))
              ) : (
                <span>Al momento non ci sono prenotazioni</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
