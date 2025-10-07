import React from "react";

const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
  // Define a mapping of status numbers to their text and styling
  const statusConfig = {
    0: { text: "Pending", class: "bg-warning text-dark" },
    1: { text: "Approved", class: "bg-success" },
    2: { text: "Rejected", class: "bg-danger" },
  };

  // Look up the configuration based on the status prop.
  // Use a fallback for any unexpected status value.
  const config = statusConfig[status as keyof typeof statusConfig] || { text: "Unknown", class: "bg-secondary" };

  return (
    <span className={`badge ${config.class} d-inline-flex align-items-center`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;
