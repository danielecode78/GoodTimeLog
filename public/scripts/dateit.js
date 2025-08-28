module.exports = dateit = (element) => {
  let finaldate = "Data non inserita";
  if (element) {
    const arrdate = element.split("-");
    finaldate = `${arrdate[2]}-${arrdate[1]}-${arrdate[0]}`;
  }
  return finaldate;
};
