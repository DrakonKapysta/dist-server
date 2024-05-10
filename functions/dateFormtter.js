exports.parseToDateTimeFormat = (date, time) => {
  const dateWithTime = `${date}T${time}`;
  const formatedDate = new Date(dateWithTime);
  return formatedDate;
};
exports.getTodaysDateWithoutTime = () => {
  const date = new Date();
  const parsedDate = `${date.getFullYear()} ${
    date.getMonth() + 1
  } ${date.getDate()}`;
  return parsedDate;
};
