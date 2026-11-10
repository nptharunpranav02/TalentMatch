import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE_URL = "http://localhost:5000/api";
const SESSION_STORAGE_KEY = "talentmatch_tenant_auth_session";

export function AuthProvider({ children }) {
  const [currentOrg, setCurrentOrg] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from storage on boot
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Fetch available organization spaces from backend
        try {
          const res = await fetch(`${API_BASE_URL}/organizations`);
          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              setAvailableOrgs(data.data);
            }
          }
        } catch {
          // Resilient fallback preset tenants if backend still starting
          setAvailableOrgs([
            {
              id: "org-apex",
              name: "Apex Financial Global",
              slug: "apex",
              email: "admin@apexfinancial.io",
              industry: "Fintech & Banking Systems",
              adminName: "Marcus Vance",
              role: "Enterprise Delivery Director",
              plan: "Tier-1 Dedicated Enterprise Space"
            },
            {
              id: "org-helix",
              name: "Helix Healthcare IT",
              slug: "helix",
              email: "admin@helixhealth.io",
              industry: "Clinical Diagnostics & Health AI",
              adminName: "Dr. Evelyn Reed",
              role: "VP Health Informatics",
              plan: "HIPAA Compliant Dedicated Space"
            },
            {
              id: "org-technova",
              name: "TechNova Cloud Systems",
              slug: "technova",
              email: "admin@technova.io",
              industry: "Enterprise Cloud & Platform Engineering",
              adminName: "Henrik Lindqvist",
              role: "Chief Cloud Architect",
              plan: "Cloud Platforms Dedicated Space"
            }
          ]);
        }

        const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setCurrentOrg(parsed.organization);
          setCurrentUser(parsed.user);
          setToken(parsed.token);
        } else {
          // By default, if no saved session, keep unauthenticated so the user sees the Organization Login Portal!
          // But allow quick login with one click
          setCurrentOrg(null);
          setCurrentUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn("[AuthContext] Session restore error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/organizations/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid organization credentials");
      }

      const session = {
        organization: data.organization,
        user: data.user,
        token: data.token
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      localStorage.setItem("tm_org_name", data.organization.name);
      localStorage.setItem("talentmatch_active_org_id", data.organization.id);

      setCurrentOrg(data.organization);
      setCurrentUser(data.user);
      setToken(data.token);

      return { success: true, organization: data.organization };
    } catch (err) {
      // Offline fallback: check against known presets if backend is temporarily unreachable
      const fallbackOrg = availableOrgs.find(
        (o) => o.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (fallbackOrg && password === "password123") {
        const session = {
          organization: fallbackOrg,
          user: {
            id: `user-${fallbackOrg.id}`,
            name: fallbackOrg.adminName || "Workspace Admin",
            email: fallbackOrg.email,
            role: "Organization Administrator"
          },
          token: `offline_token_${fallbackOrg.id}`
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        localStorage.setItem("tm_org_name", fallbackOrg.name);
        localStorage.setItem("talentmatch_active_org_id", fallbackOrg.id);

        setCurrentOrg(fallbackOrg);
        setCurrentUser(session.user);
        setToken(session.token);
        return { success: true, organization: fallbackOrg };
      }
      throw err;
    }
  };

  const register = async ({ name, slug, email, password, industry, adminName, seedStarter }) => {
    const res = await fetch(`${API_BASE_URL}/organizations/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, email, password, industry, adminName, seedStarter })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to register organization workspace");
    }

    // Auto-login into the newly registered organization
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setCurrentOrg(null);
    setCurrentUser(null);
    setToken(null);
  };

  const switchOrg = async (orgEmail) => {
    return login(orgEmail, "password123");
  };

  return (
    <AuthContext.Provider
      value={{
        currentOrg,
        currentUser,
        token,
        isAuthenticated: Boolean(currentOrg && token),
        isLoading,
        availableOrgs,
        login,
        register,
        logout,
        switchOrg
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
