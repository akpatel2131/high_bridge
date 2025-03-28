import React, { useState } from "react";
import styles from "./Workflow.module.css";
import { FaPlus, FaTrash, FaSave, FaChevronLeft } from "react-icons/fa";
import NodeConfig from "./NodeConfig";
import SaveWorkflowModal from "../SaveWorkflowModal/SaveWorkflowModal";
import workFlowArrow from "../../Images/WorkFlow/work_flow_arrow.svg";
import startFlow from "../../Images/WorkFlow/start_flow.svg";
import endFlow from "../../Images/WorkFlow/end_flow.svg";
import Tooltip from "../Common/Tooltip/Tooltip";
import clsx from "clsx";

const Workflow = () => {
  const [nodes, setNodes] = useState([
    {
      id: "api1",
      type: "api",
      label: "API Call",
      details: { method: "GET", url: "https://api.example.com/data" },
    },
    { id: "email1", type: "email", label: "Email", details: { email: "test@example.com" } },
    {
      id: "text1",
      type: "text",
      label: "Text Box",
      details: { message: "This is a test message" },
    },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [title, setTitle] = useState("Untitled");
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);

  const handleAddNode = (index, nodeType) => {
    const newNode = { id: `${nodeType}${index}`, type: nodeType, details: {} };
    const newNodes = [...nodes];
    newNodes.splice(index + 1, 0, newNode);
    setNodes(newNodes);
  };

  const handleDeleteNode = (id) => {
    // Don't allow deletion of start or end nodes
    if (id === "start" || id === "end") return;

    setNodes(nodes.filter((node) => node.id !== id));
    if (selectedNode && selectedNode.id === id) {
      setSelectedNode(null);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleGoBack = () => {
    // navigate("/")
  };

  const handleOpenSaveModal = () => {
    setSaveModalOpen(true);
  };

  const handleSaveWorkflow = (workflowData) => {
    setTitle(workflowData.name);
    // Here you would typically save the workflow data to your backend
    console.log("Saving workflow:", { ...workflowData, nodes });
  };

  return (
    <div className={styles.workflowContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>
          {`<-`} Go Back
        </button>
        <span>{title}</span>
        <button className={styles.saveButton} onClick={handleOpenSaveModal}>
          <FaSave />
        </button>
      </div>

      <div className={styles.workflowContent}>
        <div className={styles.nodesContainer}>
          <img src={startFlow} />
          {nodes.map((node) => (
            <React.Fragment key={node.id}>
              <Tooltip options={["API Call", "Email", "Text Box"]}>
                <img src={workFlowArrow} />
              </Tooltip>
              <div
                className={clsx(styles.node, {
                  [styles.selected]: selectedNode?.id === node.id,
                })}
                onClick={() => handleNodeClick(node)}
              >
                <div className={styles.nodeLabel}>{node.label}</div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNode(node.id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </React.Fragment>
          ))}
          <Tooltip
            options={["API Call", "Email", "Text Box"]}
            onClick={() => handleAddNode(nodes.length, "api")}
          >
            <img src={workFlowArrow} />
          </Tooltip>
          <img src={endFlow} />
        </div>

        {selectedNode && (
          <NodeConfig
            nodes={nodes}
            setNode={setNodes}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        )}
      </div>

      <SaveWorkflowModal
        isOpen={isSaveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveWorkflow}
        initialName={title !== "Untitled" ? title : ""}
      />
    </div>
  );
};

export default Workflow;
