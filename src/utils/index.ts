export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatDate = (date: Date) => {
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const validateMail = (email: string) =>
  email.match('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
