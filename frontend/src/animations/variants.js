export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
};

export const listItemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.04, duration: 0.25, ease: "easeOut" },
  }),
};

export const hoverLift = {
  whileHover: { y: -4, scale: 1.01 },
  whileTap: { scale: 0.99 },
};
