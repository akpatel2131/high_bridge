import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";
import styles from "./Workflow.module.css";
import { FaTrash, FaSave } from "react-icons/fa";
import NodeConfig from "./NodeConfig";
import SaveWorkflowModal from "../SaveWorkflowModal/SaveWorkflowModal";
import workFlowArrow from "../../Images/WorkFlow/work_flow_arrow.svg";
import startFlow from "../../Images/WorkFlow/start_flow.svg";
import endFlow from "../../Images/WorkFlow/end_flow.svg";
import downArrow from "../../Images/WorkFlow/down_arrow.svg";
import failIcon from "../../Images/WorkFlow/fail_icon.svg";
import successIcon from "../../Images/WorkFlow/success_icon.svg";
import Tooltip from "../Common/Tooltip/Tooltip";
import clsx from "clsx";
import { useWorkflow } from "../../context/WorkflowContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Common/Loader/Loader";

const Workflow = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchWorkflowById, createWorkflow, updateWorkflow, loading } =
    useWorkflow();
  const { showNotification } = useAuth();

  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [title, setTitle] = useState("Untitled");
  const [description, setDescription] = useState("");
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);

  const workflowId = searchParams.get("id");
  const status = searchParams.get("status");

  useEffectOnce(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  });

  useEffect(() => {
    const loadWorkflow = async () => {
      if (workflowId) {
        try {
          const workflow = await fetchWorkflowById(workflowId);
          if (workflow) {
            setTitle(workflow.title);
            setDescription(workflow.description);
            setNodes(workflow.workflow);
          }
          showNotification("Workflow loaded successfully!", "success");
        } catch (error) {
          showNotification(error.message, "error");
        }
      }
    };
    loadWorkflow();
  }, [workflowId, fetchWorkflowById]);

  const handleAddNode = useCallback(
    (index, nodeType) => {
      const type =
        nodeType === "API Call"
          ? "api"
          : nodeType === "Email"
          ? "email"
          : "text";
      const newNode = {
        id: `${type}_${Date.now()}`,
        type: type,
        label: nodeType,
        details: {},
      };

      const newNodes = [...nodes];
      newNodes.splice(index + 1, 0, newNode);
      setNodes(newNodes);
    },
    [nodes]
  );

  const handleDeleteNode = (id) => {
    if (id === "start" || id === "end") return;
    setNodes(nodes.filter((node) => node.id !== id));
    if (selectedNode && selectedNode.id === id) {
      setSelectedNode(null);
    }
  };

  const handleSaveWorkflow = useCallback(
    async (data) => {
      try {
        if (workflowId) {
          await updateWorkflow(workflowId, {
            title: data.name,
            description: data.description,
            nodes,
          });
        } else {
          await createWorkflow(data.name, data.description, nodes);
        }
        navigate(`/home`);
        showNotification("Workflow saved successfully!", "success");
      } catch (error) {
        showNotification(error.message, "error");
      }
    },
    [
      createWorkflow,
      updateWorkflow,
      navigate,
      showNotification,
      workflowId,
      nodes,
    ]
  );

  if (loading) {
    return <Loader size={20} />;
  }

  return (
    <div className={styles.workflowContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/home")}>
          {"<-"} Go Back
        </button>
        <span>{title}</span>
        {status ? (
          <div
            className={clsx(styles.status, {
              [styles.passed]: status === "passed",
              [styles.failed]: status !== "passed",
            })}
          >
            {status}
          </div>
        ) : (
          <button
            className={styles.saveButton}
            onClick={() => setSaveModalOpen(true)}
          >
            <FaSave />
          </button>
        )}
      </div>

      <div className={styles.workflowContent}>
        <div className={styles.nodesContainer}>
          <img src={startFlow} alt="Start" />
          {nodes.map((node) => (
            <React.Fragment key={node.id}>
              {status ? (
                <img src={downArrow} alt="Down Arrow" />
              ) : (
                <Tooltip
                  options={["API Call", "Email", "Text Box"]}
                  onSelect={(option) => handleAddNode(nodes.length, option)}
                >
                  <img src={workFlowArrow} alt="Arrow" />
                </Tooltip>
              )}
              <div
                className={clsx(styles.node, {
                  [styles.selected]: selectedNode?.id === node.id || status,
                })}
                onClick={() => setSelectedNode(node)}
              >
                <div className={styles.nodeLabel}>{node.label}</div>
                {status ? (
                  <img
                    src={status === "passed" ? successIcon : failIcon}
                    alt="Status"
                  />
                ) : (
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode(node.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}
          {status ? (
            <img src={downArrow} alt="Down Arrow" />
          ) : (
            <Tooltip
              options={["API Call", "Email", "Text Box"]}
              onSelect={(type) => handleAddNode(nodes.length, type)}
            >
              <img src={workFlowArrow} alt="Arrow" />
            </Tooltip>
          )}
          <img src={endFlow} alt="End" />
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
        initialDescription={description || ""}
      />
    </div>
  );
};

export default Workflow;
