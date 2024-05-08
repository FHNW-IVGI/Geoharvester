export const getIcon = (id: string) => {
  const target = id === "Bund" ? "ch" : id.toLocaleLowerCase();
  return `/cantonIcons/${target}.svg`;
};
