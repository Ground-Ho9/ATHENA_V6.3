
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [isOperatorMode, setIsOperatorMode] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('operator_mode');
      if (saved === 'true') setIsOperatorMode(true);
    })();
  }, []);

  const [saving, setSaving] = useState(false);
  const toggleOperatorMode = async () => {
    if (saving) return;
    setSaving(true);
    const newVal = !isOperatorMode;
    setIsOperatorMode(newVal);
    await AsyncStorage.setItem('operator_mode', newVal.toString());
      } catch (e) {
      console.warn('Failed to load accessibility mode:', e);
    }
  };

  return (
    <AccessibilityContext.Provider value={{ isOperatorMode, toggleOperatorMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
    } catch (e) {
      console.warn('Failed to load accessibility mode:', e);
    }
  };

export const useAccessibility = () => useContext(AccessibilityContext);
