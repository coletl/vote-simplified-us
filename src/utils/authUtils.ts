
import { supabase } from "@/integrations/supabase/client";

// Clean up auth state (useful for preventing authentication limbo states)
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Robust sign out function
export const signOut = async () => {
  try {
    // Clean up auth state
    cleanupAuthState();
    // Attempt global sign out
    await supabase.auth.signOut({ scope: 'global' });
    // Force page reload for a clean state
    window.location.href = '/auth';
  } catch (error) {
    console.error('Sign out error:', error);
    // Force redirect even if sign out fails
    window.location.href = '/auth';
  }
};

// Get current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};
