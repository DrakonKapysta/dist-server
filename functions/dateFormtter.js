exports.parseToDateTimeFormat = (date, time) => {
  const dateWithTime = `${date}T${time}`;
  const formatedDate = new Date(dateWithTime);
  return formatedDate;
};
