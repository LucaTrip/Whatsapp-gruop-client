import { useContext, useEffect } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import { GlobalContext } from "./contexts/GlobalContext";
import { ELocalStoragekeys } from "./models/types";

function App() {
  const { onAddFavouriteUsers } = useContext(GlobalContext);

  useEffect(() => {
    const _members = localStorage.getItem(ELocalStoragekeys.FAVOURITE_MEMBERS);

    if (_members) {
      onAddFavouriteUsers(JSON.parse(_members));
    }
  }, [onAddFavouriteUsers]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="space-y-10 divide-y divide-gray-900/10">
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
      </div>
    </div>
  );
}

export default App;
