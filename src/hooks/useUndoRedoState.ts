
import { useState, useCallback } from 'react';
import { toast } from "sonner";

/**
 * A custom hook that adds undo/redo capability to state management
 * @param initialState The initial state
 * @returns An object containing the current state, a setter function, and undo/redo functions
 */
export function useUndoRedoState<T>(initialState: T) {
  // The complete history of states
  const [states, setStates] = useState<T[]>([initialState]);
  
  // The current position in the history
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get the current state (the state at the current index)
  const currentState = states[currentIndex];
  
  // Function to set the state
  const setState = useCallback((newState: T) => {
    console.log("Setting new state:", newState);
    
    // If we're somewhere in the middle of the history,
    // discard all future states
    if (currentIndex < states.length - 1) {
      setStates(prev => prev.slice(0, currentIndex + 1));
    }
    
    // Add the new state to the history and move to it
    setStates(prev => [...prev, newState]);
    setCurrentIndex(prev => prev + 1);
  }, [states, currentIndex]);
  
  // Undo function to go back in history
  const undo = useCallback(() => {
    // Check if we can undo (not at the beginning of history)
    if (currentIndex > 0) {
      console.log(`UNDO: Moving from index ${currentIndex} to ${currentIndex - 1}`);
      setCurrentIndex(prev => prev - 1);
      toast.success("Undo successful");
      return states[currentIndex - 1]; // Return the previous state, not just a boolean
    } else {
      console.log("Cannot undo - at beginning of history");
      toast.info("Nothing to undo");
      return null; // Return null instead of false
    }
  }, [currentIndex, states]);
  
  // Redo function to go forward in history
  const redo = useCallback(() => {
    // Check if we can redo (not at the end of history)
    if (currentIndex < states.length - 1) {
      console.log(`REDO: Moving from index ${currentIndex} to ${currentIndex + 1}`);
      setCurrentIndex(prev => prev + 1);
      toast.success("Redo successful");
      return states[currentIndex + 1]; // Return the next state, not just a boolean
    } else {
      console.log("Cannot redo - at end of history");
      toast.info("Nothing to redo");
      return null; // Return null instead of false
    }
  }, [currentIndex, states.length, states]);
  
  // Reset the history to a specific state
  const resetHistory = useCallback((state: T) => {
    setStates([state]);
    setCurrentIndex(0);
  }, []);
  
  // Properties indicating whether undo/redo are available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < states.length - 1;
  
  return {
    state: currentState,
    setState,
    undo,
    redo,
    resetHistory,
    canUndo,
    canRedo,
    history: {
      states,
      currentIndex
    }
  };
}
