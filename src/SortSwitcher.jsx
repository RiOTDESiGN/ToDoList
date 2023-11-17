import React, { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";

const SortSwitcher = ({ tasks, onSortedTasksChange }) => {
  const [sortOption, setSortOption] = useState("time");
  const [sortOrder, setSortOrder] = useState("desc");

  const anyTaskUpdated = tasks.some((task) => task.dateUpdated);

  const options = [
    { value: "time", label: "Sort by creation time", disabled: false },
    { value: "status", label: "Sort by status", disabled: false },
    {
      value: "updated",
      label: "Sort by time updated",
      disabled: !anyTaskUpdated,
    },
    { value: "title", label: "Sort by title", disabled: false },
  ];

  const getTime = (dateString) => {
    if (!dateString) return -Infinity;
    const parts = dateString.match(
      /(\d{2})\.(\d{2})\.(\d{4})\n(\d{2}):(\d{2}):(\d{2})/
    );
    if (parts) {
      const [, day, month, year, hour, minute, second] = parts;
      return new Date(year, month - 1, day, hour, minute, second).getTime();
    }
    return -Infinity;
  };

  const sortTasks = (a, b) => {
    let comparison = 0;
    if (sortOption === "time") {
      comparison = getTime(a.dateCreated) - getTime(b.dateCreated);
    } else if (sortOption === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortOption === "updated") {
      const timeA = a.dateUpdated ? getTime(a.dateUpdated) : -Infinity;
      const timeB = b.dateUpdated ? getTime(b.dateUpdated) : -Infinity;
      comparison = timeA - timeB;
    } else if (sortOption === "title") {
      comparison = a.title.localeCompare(b.title);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  };

  useEffect(() => {
    const sortedTasks = [...tasks].sort(sortTasks);
    onSortedTasksChange(sortedTasks);
  }, [sortOption, sortOrder, tasks, onSortedTasksChange]);

  const SortButton = ({ order }) => (
    <button
      onClick={() => setSortOrder(order)}
      className={`sort-button
                  ${sortOrder === order ? "sort-button-active" : ""}
                  ${order === "desc" ? "desc-button" : ""}
                `}
    >
      {order.charAt(0).toUpperCase() + order.slice(1)}
    </button>
  );

  return (
    <div className="sortSwitcher">
      <CustomSelect
        value={sortOption}
        onChange={setSortOption}
        options={options}
      />
      <SortButton order="asc" />
      <SortButton order="desc" />
    </div>
  );
};

export default SortSwitcher;
