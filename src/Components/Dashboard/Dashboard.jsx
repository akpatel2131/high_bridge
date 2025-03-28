import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import {
  FaStar,
  FaRegStar,
  FaSearch,
  FaPlus,
  FaEllipsisV,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import dashboardMenu from "../../Images/DashboardImages/dashboard_menu.svg";
import Pagination from "../Common/Pagination/Pagination";
import ExecutionModal from "../ExecutionModal/ExecutionModal";

const Dashboard = () => {
  const [expandedWorkflow, setExpandedWorkflow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const itemsPerPage = 10;
  const totalPages = 15; // This would typically come from your API

  // Mock data for workflows
  const workflows = [
    {
      id: "#494",
      name: "Workflow Name here...",
      lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
      description: "Some Description Here Regarding The Flow..",
      isFavorite: true,
      history: [
        { timestamp: "28/05 - 22:43 IST", status: "Passed" },
        { timestamp: "28/05 - 22:43 IST", status: "Failed" },
        { timestamp: "28/05 - 22:43 IST", status: "Failed" },
      ],
    },
    {
      id: "#494",
      name: "Workflow Name here...",
      lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
      description: "Some Description Here Regarding The Flow..",
      isFavorite: true,
    },
    {
      id: "#494",
      name: "Workflow Name here...",
      lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
      description: "Some Description Here Regarding The Flow..",
      isFavorite: false,
    },
    {
      id: "#494",
      name: "Workflow Name here...",
      lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
      description: "Some Description Here Regarding The Flow..",
      isFavorite: false,
    },
    {
      id: "#494",
      name: "Workflow Name here...",
      lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
      description: "Some Description Here Regarding The Flow..",
      isFavorite: false,
    },
    {
      id: "#494",
      name: "Workflow Name here...",
      lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
      description: "Some Description Here Regarding The Flow..",
      isFavorite: false,
    },
  ];

  const toggleExpand = (index) => {
    if (expandedWorkflow === index) {
      setExpandedWorkflow(null);
    } else {
      setExpandedWorkflow(index);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Here you would typically fetch data for the new page
  };

  const handleExecute = (workflow) => {
    setSelectedWorkflow(workflow);
    setIsExecutionModalOpen(true);
  };

  const handleConfirmExecution = () => {
    // Handle the execution confirmation here
    console.log(`Executing workflow: ${selectedWorkflow.name}`);
    setIsExecutionModalOpen(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <img src={dashboardMenu} alt="Dashboard Menu" />
        <h1 className={styles.title}>Workflow Builder</h1>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search By Workflow Name/ID"
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
        <button className={styles.createButton}>
          <FaPlus /> Create New Process
        </button>
      </div>

      <div className={styles.workflowTable}>
        <div className={styles.tableHeader}>
          <div className={styles.workflowName}>Workflow Name</div>
          <div className={styles.workflowId}>ID</div>
          <div className={styles.lastEdited}>Last Edited On</div>
          <div className={styles.description}>Description</div>
          <div className={styles.actions}></div>
        </div>

        {workflows.map((workflow, index) => (
          <React.Fragment key={index}>
            <div className={styles.tableRow}>
              <div className={styles.workflowName}>{workflow.name}</div>
              <div className={styles.workflowId}>{workflow.id}</div>
              <div className={styles.lastEdited}>{workflow.lastEdited}</div>
              <div className={styles.description}>{workflow.description}</div>
              <div className={styles.actions}>
                <button className={styles.favoriteButton}>
                  {workflow.isFavorite ? (
                    <FaStar className={styles.favoriteIcon} />
                  ) : (
                    <FaRegStar className={styles.favoriteIcon} />
                  )}
                </button>
                <button 
                  className={styles.executeButton}
                  onClick={() => handleExecute(workflow)}
                >
                  Execute
                </button>
                <button className={styles.editButton}>Edit</button>
                <button className={styles.optionsButton}>
                  <FaEllipsisV />
                </button>
                <button
                  className={styles.expandButton}
                  onClick={() => toggleExpand(index)}
                >
                  {expandedWorkflow === index ? <FaArrowUp /> : <FaArrowDown />}
                </button>
              </div>
            </div>

            {expandedWorkflow === index && workflow.history && (
              <div className={styles.expandedContent}>
                {workflow.history.map((item, historyIndex) => (
                  <div key={historyIndex} className={styles.historyItem}>
                    <div className={styles.historyTimeline}>
                      <div className={styles.timelineDot}></div>
                      <div className={styles.timelineLine}></div>
                    </div>
                    <div className={styles.historyContent}>
                      <div className={styles.historyTimestamp}>
                        {item.timestamp}
                      </div>
                      <div
                        className={`${styles.historyStatus} ${
                          item.status === "Passed"
                            ? styles.statusPassed
                            : styles.statusFailed
                        }`}
                      >
                        {item.status}
                      </div>
                      <button className={styles.viewDetailsButton}>
                        <FaExternalLinkAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {selectedWorkflow && (
        <ExecutionModal
          isOpen={isExecutionModalOpen}
          onClose={() => setIsExecutionModalOpen(false)}
          processName={selectedWorkflow.name}
          onConfirm={handleConfirmExecution}
        />
      )}
    </div>
  );
};

export default Dashboard;
