const Spinner = ({ small = false }) => {
  return (
    <div
      className={`${small ? "h-5 w-5 border-2" : "h-10 w-10 border-4"} animate-spin rounded-full border-primary-500 border-t-transparent`}
      aria-label="loading"
    />
  );
};

export default Spinner;
