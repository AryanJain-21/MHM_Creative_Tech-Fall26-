import { ArrowLeftIcon } from "./icons";

export default function PageHeader({ title, onBack, children }) {
  return (
    <div className="page-head">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeftIcon className="back-icon" />
        Back
      </button>
      <div className="page-head-row">
        <h1 className="page-title">{title}</h1>
        {children}
      </div>
    </div>
  );
}
