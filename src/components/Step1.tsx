import { useContext, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Player } from "@lottiefiles/react-lottie-player";
import GeneralLoading from "../assets/lotties/loading.json";
import { GlobalContext } from "../contexts/GlobalContext";

export default function Step1() {
  const [authStatus, setAuthStatus] = useState<
    "waiting_wa" | "user_authenticated" | "user_disconnected"
  >("waiting_wa");

  const {
    state: { waUserLogged, waQrCode },
  } = useContext(GlobalContext);

  useEffect(() => {
    if (waUserLogged !== undefined)
      setAuthStatus(waUserLogged ? "user_authenticated" : "user_disconnected");
  }, [waUserLogged]);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Connessione a Whatsapp
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Qui potrai loggarti con il tuo account Whatsapp. Una volta autenticato
          la tua connessione sarà permanente.
        </p>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          {waQrCode.length && !waUserLogged ? (
            <div
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 256,
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={waQrCode}
                viewBox={`0 0 256 256`}
              />
            </div>
          ) : authStatus === "waiting_wa" ? (
            <div className="flex justify-center items-center">
              <Player
                autoplay
                loop
                src={GeneralLoading}
                className="w-20 h-20"
              ></Player>
              <span>Creando l'istanza di Whatsapp...</span>
            </div>
          ) : authStatus === "user_authenticated" ? (
            <div className="flex justify-center">
              <span>Utente autenticato correttamente 🎉</span>
            </div>
          ) : authStatus === "user_disconnected" ? (
            <div className="flex justify-center">
              <span>Utente disconnesso</span>
            </div>
          ) : undefined}
        </div>
      </form>
    </div>
  );
}
