export const isEmptyData = (setError, inputName, data) => {
  console.log("inputName", inputName);
  console.log("data", data);

  if (data?.toString()?.length === 0 || !data) {
    setError({ ...errors, [inputName]: "Không được để trống ô này!" });
  }
};
