const compareForSort = (a, b) => {
  const dateA = new Date(a.endDate);
  const dateB = new Date(b.endDate);
  return dateA - dateB;
};

export { compareForSort };
