export const getIcon = (id: string) => {
  const target = id === "Bund" ? "ch" : id.slice(3, 5).toLocaleLowerCase();
  return `/cantonIcons/${target}.svg`;
};
