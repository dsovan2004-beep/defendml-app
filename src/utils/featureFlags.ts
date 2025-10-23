/**
 * Feature Flags — DefendML App
 * Controls visibility of gated UI routes and components.
 */

const getBooleanFlag = (key: string): boolean => {
  try {
    return process.env[key] === "true";
  } catch {
    return false;
  }
};

// Individual feature flags
export const FF_ASL3_STATUS = getBooleanFlag("NEXT_PUBLIC_FF_ASL3_STATUS");
export const FF_INCIDENT_CENTER = getBooleanFlag("NEXT_PUBLIC_FF_INCIDENT_CENTER");

// Grouped export for convenience
export const FeatureFlags = {
  FF_ASL3_STATUS,
  FF_INCIDENT_CENTER,
};
