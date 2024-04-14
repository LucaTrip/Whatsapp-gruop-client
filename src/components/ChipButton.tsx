import { TrashIcon } from "@heroicons/react/24/outline";
import { IFavouriteMember } from "../models/models";

interface IChipButton {
  user: IFavouriteMember;
  onHandleDelete: () => void;
}

export default function ChipButton({ user, onHandleDelete }: IChipButton) {
  function getUserInitials() {
    const _splittedUserName = user.fullName.split(" ");
    if (_splittedUserName.length === 1) {
      return `${_splittedUserName[0].substring(0, 1).toUpperCase()}`;
    } else {
      return `${_splittedUserName[0]
        .substring(0, 1)
        .toUpperCase()}${_splittedUserName[1].substring(0, 1).toUpperCase()}`;
    }
  }

  return (
    <div className="bg-gray-100 flex items-center rounded-full space-x-2 w-fit p-1">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-500">
        <span className="text-[10px] font-medium leading-none text-white">
          {getUserInitials()}
        </span>
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-sm">{user.fullName}</span>
        <span className="text-[10px] font-medium">{user.phoneNumber}</span>
      </div>
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full"
        onClick={onHandleDelete}
      >
        <TrashIcon width={15} height={15} color="" />
      </button>
    </div>
  );
}
