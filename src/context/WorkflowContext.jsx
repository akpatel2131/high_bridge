import React, { createContext, useContext, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";

const WorkflowContext = createContext(null);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};

export const WorkflowProvider = ({ children }) => {
  const { user, showNotification } = useAuth();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        setWorkflows([]);
        return [];
      }

      const workflowsRef = collection(db, "workflows");
      const q = query(workflowsRef, where("user_id", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const workflowData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setWorkflows(workflowData);
      return workflowData;
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, showNotification]);

  const fetchWorkflowById = useCallback(async (workflowId) => {
    try {
      setLoading(true);
      const workflowRef = doc(db, "workflows", workflowId);
      const workflowSnap = await getDoc(workflowRef);

      if (workflowSnap.exists()) {
        return { id: workflowSnap.id, ...workflowSnap.data() };
      }
      return null;
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const createWorkflow = useCallback(async (title, description, nodes) => {
    try {
      if (!user) throw new Error("User not authenticated");
      setLoading(true);

      const workflowData = {
        title,
        description,
        uuid: `#${workflows.length}`,
        user_id: user.uid,
        edit_details: [
          {
            date: Timestamp.now(),
            time: new Date().toLocaleTimeString(),
            status: "passed",
          },
        ],
        workflow: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          label: node.label || "",
          details: node.details,
        })),
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "workflows"), workflowData);
      const newWorkflow = { id: docRef.id, ...workflowData };
      setWorkflows((prev) => [...prev, newWorkflow]);
      showNotification("Workflow created successfully", "success");
      return newWorkflow;
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, showNotification, workflows]);

  const updateWorkflow = useCallback(async (workflowId, { title, description, nodes }) => {
    try {
      const workflowRef = doc(db, "workflows", workflowId);
      const workflowSnap = await getDoc(workflowRef);

      if (!workflowSnap.exists()) {
        throw new Error("Workflow not found");
      }

      setLoading(true);

      const currentWorkflow = workflowSnap.data();
      const updateData = {
        title: title || currentWorkflow.title,
        description: description || currentWorkflow.description,
        edit_details: [
          ...currentWorkflow.edit_details,
          {
            date: Timestamp.now(),
            time: new Date().toLocaleTimeString(),
            status: "passed",
          },
        ],
        workflow: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          label: node.label || "",
          details: node.details,
        })),
        updated_at: Timestamp.now(),
      };

      await updateDoc(workflowRef, updateData);

      setWorkflows((prev) =>
        prev.map((wf) => (wf.id === workflowId ? { ...wf, ...updateData } : wf))
      );
      
      showNotification("Workflow updated successfully", "success");
      return { id: workflowId, ...updateData };
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const deleteWorkflow = useCallback(async (workflowId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "workflows", workflowId));
      setWorkflows((prev) => prev.filter((wf) => wf.id !== workflowId));
      showNotification("Workflow deleted successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const value = {
    workflows,
    fetchWorkflows,
    fetchWorkflowById,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    loading,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};
