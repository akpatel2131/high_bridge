import React, { useRef, useEffect } from "react";
import styles from "./Workflow.module.css";

const NodeConfig = ({ nodes, setNode, selectedNode, setSelectedNode }) => {
  const configRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (configRef.current && !configRef.current.contains(event.target)) {
        setSelectedNode(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSelectedNode]);

  const handleConfigHeaderClick = () => {
    setSelectedNode(null);
  };

  const handleChange = (field, value) => {
    const updatedNode = nodes.map((node) =>
      node.id === selectedNode.id
        ? { ...node, details: { ...node.details, [field]: value } }
        : node
    );
    setNode(updatedNode);
    setSelectedNode({
      ...selectedNode,
      details: { ...selectedNode.details, [field]: value },
    });
  };

  const renderConfigFields = () => {
    switch (selectedNode.type) {
      case "api":
        return (
          <>
            <div className={styles.configField}>
              <label>Method</label>
              <select onChange={(e) => handleChange("method", e.target.value)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className={styles.configField}>
              <label>URL</label>
              <input
                type="text"
                placeholder="Type here..."
                value={selectedNode.details.url}
                onChange={(e) => handleChange("url", e.target.value)}
              />
            </div>
            <div className={styles.configField}>
              <label>Headers</label>
              <input
                type="text"
                placeholder="Header Name"
                value={selectedNode.details.headers}
                onChange={(e) => handleChange("headers", e.target.value)}
              />
            </div>
            <div className={styles.configField}>
              <label>Body</label>
              <textarea
                placeholder="Enter Descriptions..."
                value={selectedNode.details.body}
                onChange={(e) => handleChange("body", e.target.value)}
              />
            </div>
          </>
        );
      case "email":
        return (
          <div className={styles.configField}>
            <label>Email</label>
            <input
              type="text"
              placeholder="Type here..."
              value={selectedNode.details.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        );
      case "text":
        return (
          <div className={styles.configField}>
            <label>Message</label>
            <textarea
              placeholder="Enter Message..."
              value={selectedNode.details.message}
              onChange={(e) => handleChange("message", e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.nodeConfig} ref={configRef}>
      <div className={styles.configHeader} onClick={handleConfigHeaderClick}>
        Configuration
      </div>
      <div className={styles.configContent}>{renderConfigFields()}</div>
    </div>
  );
};

export default NodeConfig;
