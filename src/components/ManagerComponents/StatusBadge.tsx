import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { class: string; icon: any }> = {
    Pending: { class: "bg-warning text-dark", icon: Clock },
    Approved: { class: "bg-success", icon: CheckCircle },
    Rejected: { class: "bg-danger", icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig["Pending"];
  const Icon = config.icon;
  return (
    <span className={`badge ${config.class} d-inline-flex align-items-center`}>
      <Icon size={14} className="me-1" />
      {status}
    </span>
  );
};

export default StatusBadge;