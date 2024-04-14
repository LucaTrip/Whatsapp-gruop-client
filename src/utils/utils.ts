function convertKrossDate(date: string) {
  const splittedDate = date.split("-");
  return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
}

function getTheDateBefore() {
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  return yesterday;
}

export { convertKrossDate, getTheDateBefore };
