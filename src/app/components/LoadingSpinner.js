import { BeatLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <BeatLoader color="#36D7B7" loading={true} />
    </div>
  );
};

export default LoadingSpinner;
