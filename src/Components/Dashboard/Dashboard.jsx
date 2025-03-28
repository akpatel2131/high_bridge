import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import styles from "./Dashboard.module.css";
import {
  FaSearch,
  FaPlus,
  FaEllipsisV,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import dashboardMenu from "../../Images/DashboardImages/dashboard_menu.svg";
import Pagination from "../Common/Pagination/Pagination";
import ExecutionModal from "../ExecutionModal/ExecutionModal";
import { useWorkflow } from "../../context/WorkflowContext";
import { useAuth } from "../../context/AuthContext";
import Tooltip from "../Common/Tooltip/Tooltip";
import Loader from "../Common/Loader/Loader";
import noData from "../../Images/no-data.svg"

const Dashboard = () => {
  const navigate = useNavigate();
  const { workflows, fetchWorkflows, deleteWorkflow, loading } = useWorkflow();
  const { showNotification } = useAuth();

  const [expandedWorkflow, setExpandedWorkflow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.uuid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage);
  const paginatedWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleConfirmExecution = () => {
    showNotification(`Executing workflow: ${selectedWorkflow.title}`, "info");
    setIsExecutionModalOpen(false);
  };

  const handleEdit = (workflowId, status = "") => {
    navigate(`/workflow?id=${workflowId}&&status=${status}`);
  };

  const handleDelete = useCallback(async (workflowId) => {
    try {
      await deleteWorkflow(workflowId);
      showNotification("Workflow deleted successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  }, [deleteWorkflow, showNotification]);
  

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
        <button className={styles.createButton} onClick={() => navigate("/workflow")}>
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
        {loading ? (
          <Loader size={10} />
        ) : workflows.length > 0 ? (
          paginatedWorkflows.map((workflow, index) => (
            <React.Fragment key={workflow.id}>
              <div className={styles.tableRow}>
                <div className={styles.workflowName}>{workflow.title}</div>
                <div className={styles.workflowId}>{workflow.uuid}</div>
                <div className={styles.lastEdited}>
                  {workflow.edit_details[workflow.edit_details.length - 1]
                    ?.time || "N/A"}
                </div>
                <div className={styles.description}>{workflow.description}</div>
                <div className={styles.actions}>
                  <button
                    className={styles.executeButton}
                    onClick={() => {
                      setSelectedWorkflow(workflow);
                      setIsExecutionModalOpen(true);
                    }}
                  >
                    Execute
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(workflow.id)}
                  >
                    Edit
                  </button>
                  <Tooltip
                    options={["Delete"]}
                    onSelect={() => handleDelete(workflow.id)}
                    innerClassName={{
                      tooltipContent: styles.tooltipContent,
                      option: styles.options,
                    }}
                  >
                    <FaEllipsisV />
                  </Tooltip>
                  <button
                    className={styles.expandButton}
                    onClick={() => setExpandedWorkflow(expandedWorkflow === index ? null : index)}
                  >
                    {expandedWorkflow === index ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    )}
                  </button>
                </div>
              </div>

              {expandedWorkflow === index && (
                <div className={styles.expandedContent}>
                  {workflow.edit_details.map((detail, historyIndex) => (
                    <div key={historyIndex} className={styles.historyItem}>
                      <div className={styles.historyTimeline}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineLine}></div>
                      </div>
                      <div className={styles.historyContent}>
                        <div className={styles.historyTimestamp}>
                          {format(new Date(detail.date.seconds * 1000), "dd/MM/yyyy - HH:mm") || "N/A"}
                        </div>
                        <div
                          className={`${styles.historyStatus} ${
                            detail.status === "passed"
                              ? styles.statusPassed
                              : styles.statusFailed
                          }`}
                        >
                          {detail.status}
                        </div>
                        <button className={styles.viewDetailsButton} onClick={() => handleEdit(workflow.id, detail.status)}>
                          <FaExternalLinkAlt />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div className={styles.noWorkflows}>
            <img src={noData} alt="No Workflows" />
            <div className={styles.noWorkflowsText}>No workflows found</div>
          </div>
        )}

      {paginatedWorkflows.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      </div>

      {selectedWorkflow && (
        <ExecutionModal
          isOpen={isExecutionModalOpen}
          onClose={() => setIsExecutionModalOpen(false)}
          processName={selectedWorkflow.title}
          onConfirm={handleConfirmExecution}
        />
      )}
    </div>
  );
};

export default Dashboard;

