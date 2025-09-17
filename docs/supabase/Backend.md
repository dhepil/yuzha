# 🚀 YUZHA MONOREPO - COMPLETE BACKEND INTEGRATION GUIDE

## 📋 PROJECT OVERVIEW

**Project Name**: Yuzha Monorepo - Launcher + Modules System  
**Architecture**: React Monorepo + Supabase Backend + Multi-URL Deployment  
**Current Status**: Frontend structure complete, Supabase backend deployed, Integration pending  
**Integration Goal**: Connect 6 React apps to Supabase User Hub API with secure authentication

### **Application Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Launcher    │    │    0Setting     │    │     1Meng       │
│   (Port 5000)   │    │   (Port 5001)   │    │   (Port 5002)   │
│  Auth Hub + Nav │    │  System Config  │    │ Receipts + Mgmt │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Supabase Backend     │
                    │  User Hub API + Auth      │
                    │  Multi-Schema Database    │
                    │  Edge Functions + Storage │
                    └───────────────────────────┘
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
│    3Database      │    │     4Extra        │    │     5Rara         │
│   (Port 5003)     │    │   (Port 5004)     │    │   (Port 5005)     │
│  DB Monitoring    │    │  Personal Apps    │    │  Time Tracking    │
└───────────────────┘    └───────────────────┘    └───────────────────┘
```

---

## 🔐 COMPLETE SECRETS & CONFIGURATION REFERENCE

### **🏢 Supabase Project Configuration**
```yaml
Project URL: https://xaluaekioqwxtzhnmygg.supabase.co
Project Reference ID: xaluaekioqwxtzhnmygg
Region: ap-southeast-1
Database: PostgreSQL 15
Storage: S3-Compatible with CDN
```

### **🔑 Authentication Keys & Tokens**
```bash
# JWT Configuration
JWT_SECRET: Jf9Lc703++zJxFsargVFrrP/5QJZLY09ZJMNUfLGMu/UX4833s8UrMeFTH8+6qOyJeElPkJYm2WHZNf4GtCZzQ==
ACCESS_TOKEN_EXPIRY: 3600 # seconds (1 hour)

# Public Key (Safe for frontend)
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I

# Service Role Key (BACKEND ONLY - NEVER IN FRONTEND)
SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY
```

### **💾 Storage Configuration**
```yaml
# S3-Compatible Storage
Bucket: public
Access Key ID: 270bd43e0a08583f0af6e6d93f2c7bab
Secret Access Key: 182186923e8b6644cb9280ab2389fe0b272f808d1ab4f7c49f42f957e4fd6f0b
S3 Endpoint: https://xaluaekioqwxtzhnmygg.storage.supabase.co/storage/v1/s3
Region: ap-southeast-1

# Storage Buckets Required:
# - user-assets (private): User uploaded files, documents, images
# - public-assets (public): App assets, shared resources, cached files
# - temp-uploads (private): Temporary file processing, 24h auto-delete
```

### **🤖 Google Service Account & Integration**
```json
{
  "type": "service_account",
  "project_id": "yuzhayo",
  "private_key_id": "ebbd46a05b2d022271b9d8d8840f8e25e6967156",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCCKmqVNli8VbHI\nFPk7JUScWhhdB/2VLsTzwBMFPGsEbbQVq+BPrRXpuV7DvFC27b06UULjyUjjGuPp\nmaSQ9JTRRSRovGCqUSoJhCzNpkCM3LygyH6Q48HoGaQgR5wwgCMNwEATomokybjR\nK/B1ejAiRsC5twAmXkZERJjXlIRi5J4DU1oQN4F1bci//44wjnxBQqww3cd2wQES\niOnr9HTYcNN52mvqLqe4ZpjnRNhQIsCAL1Bylnuc0gPYAz7qBJh23eNosjUr7biC\ntmqbj6f+EamPHcdlZRSZMyre1XgKDACOellWRbsEDj82l4oFKd316DPwPwxNjf0L\nyLfGtGQZAgMBAAECggEACSxpmg38N3u3nZEC1p0EBp...[FULL_KEY_TRUNCATED_FOR_BREVITY]",
  "client_email": "yuzha-967@yuzhayo.iam.gserviceaccount.com",
  "client_id": "117388252118981647923",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/yuzha-967%40yuzhayo.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

### **📊 Google Integration Targets**
```bash
# Google Drive Integration
GOOGLE_DRIVE_FOLDER_ID: 12T5SpHRfmrDjom9HcH3LDl0J9P0oe3b5
GOOGLE_DRIVE_FOLDER_NAME: "Yuzha App Submissions"

# Google Sheets Integration  
GOOGLE_SPREADSHEET_ID: 1YBhC5jsyStO3METamY2b-JOGgU-_wd-Q_7XPUBNDZ2E
GOOGLE_SPREADSHEET_NAME: "User Submissions & Analytics"

# Permissions Required:
# - Drive: read, write, create files in specified folder
# - Sheets: read, write, create sheets in specified spreadsheet
# - OAuth Scopes: drive.file, spreadsheets
```

### **🔧 Environment Variables Configuration**

#### **Development Environment (.env.local)**
```bash
# Core Supabase Configuration (ALL APPS)
VITE_SUPABASE_URL=https://xaluaekioqwxtzhnmygg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I
VITE_SUPABASE_FUNCTIONS_BASE=https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1

# Schema Configuration (Per Module)
# Launcher: (uses default 'public' schema)
# 0Setting: VITE_SUPABASE_SCHEMA=m0_setting
# 1Meng: VITE_SUPABASE_SCHEMA=m1_meng
# 3Database: VITE_SUPABASE_SCHEMA=m3_database
# 4Extra: VITE_SUPABASE_SCHEMA=m4_extra
# 5Rara: VITE_SUPABASE_SCHEMA=m5_rara

# Development URLs (for postMessage origin validation)
VITE_LAUNCHER_URL=http://localhost:5000
VITE_MODULE_URLS=http://localhost:5001,http://localhost:5002,http://localhost:5003,http://localhost:5004,http://localhost:5005

# Feature Flags
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_DEBUG_MODE=false
```

#### **Production Environment**
```bash
# Update for production deployment
VITE_LAUNCHER_URL=https://launcher.yourdomain.com
VITE_MODULE_URLS=https://setting.yourdomain.com,https://meng.yourdomain.com,https://database.yourdomain.com,https://extra.yourdomain.com,https://rara.yourdomain.com

# Same Supabase configuration (URL and keys remain identical)
# Production-specific feature flags
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
```

---

## 🎯 BACKEND API REFERENCE

### **📡 Base Configuration**
```yaml
Base URL: https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1
Authentication: Bearer JWT (access_token)
Content-Type: application/json
Rate Limiting: 100 requests/minute per user
Timeout: 30 seconds per request
```

### **🔧 Available Edge Functions**

#### **1. user-hub** (Primary Integration Target)
```typescript
// Complete User Hub API
// Endpoints:
GET    /user-hub/settings?profile={profile}     // Load UI preferences
POST   /user-hub/settings                       // Save UI preferences  
DELETE /user-hub/settings?profile={profile}     // Reset preferences

GET    /user-hub/sync-data?profile={profile}    // Load sync data
POST   /user-hub/sync-data                      // Save sync data
DELETE /user-hub/sync-data?profile={profile}    // Clear sync data

POST   /user-hub/{module}/submit                // Module form submissions
GET    /user-hub/analytics                      // User statistics

GET    /user-hub/assets?type={type}&limit={n}   // List user assets
POST   /user-hub/assets                         // Save asset metadata
DELETE /user-hub/assets/{id}                    // Delete asset
```

#### **2. Module-Specific Functions**
```typescript
// 1Meng Module
POST /meng-receipt    // Receipt submission with Google Sheets sync
POST /meng-sync       // Meng-specific data synchronization

// 5Rara Module  
POST /rara-clockin    // Clock in with timestamp and location
POST /rara-clockout   // Clock out with timestamp and duration

// 3Database Module
GET  /database-stats  // Database statistics and health metrics
POST /database-export // Generate and download database export

// General Purpose
POST /form-submit     // Original form submission with Google integration
POST /test-submit     // Test endpoint (no authentication required)
GET  /recap           // User submission history and statistics
POST /storage-retry   // Retry failed storage operations
POST /upload-drive    // Direct Google Drive upload
POST /auth            // Authentication utilities and user management
```

### **🔒 Authentication Patterns**

#### **Request Headers**
```typescript
// Authenticated requests
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json",
  "X-App-Origin": "launcher", // or module name
  "X-Request-ID": "uuid-v4"   // for request tracing
}

// Anonymous requests (test-submit only)
{
  "Content-Type": "application/json",
  "X-App-Origin": "test",
  "X-Request-ID": "uuid-v4"
}
```

#### **Response Format**
```typescript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "metadata": {
    "timestamp": "2025-09-15T12:00:00Z",
    "request_id": "uuid-v4",
    "processing_time_ms": 150
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { /* error specifics */ },
    "retryable": false
  },
  "metadata": {
    "timestamp": "2025-09-15T12:00:00Z",
    "request_id": "uuid-v4"
  }
}
```

---

## 📈 COMPREHENSIVE PHASE-BY-PHASE IMPLEMENTATION

---

## 🏗️ PHASE 1: FOUNDATION & SECURITY SETUP
**🎯 Goal**: Establish secure environment, standardize configurations, ensure zero security vulnerabilities  
**⏱️ Duration**: 1-2 sessions (2-4 hours)  
**🔥 Priority**: CRITICAL - Nothing works without proper foundation

### **🎯 Mandatory Requirements (Non-Negotiable)**
1. ✅ **NEVER expose service role key in frontend code, commits, or console logs**
2. ✅ **Use Replit's secrets management for ALL sensitive data**
3. ✅ **All apps must continue working during and after setup**
4. ✅ **Zero hardcoded URLs, keys, or credentials in source code**
5. ✅ **Test connection to Supabase before proceeding to next phase**

### **📋 Implementation Steps**

#### **Step 1.1: Secret Management & Security**
```bash
# ⚠️ CRITICAL: Set up Replit secrets (NEVER commit these)
# Use Replit secrets panel or ask_secrets tool

# Required secrets:
SUPABASE_URL=https://xaluaekioqwxtzhnmygg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I
SUPABASE_FUNCTIONS_BASE=https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1

# Optional for advanced features:
GOOGLE_SERVICE_ACCOUNT=[full_json_from_above]
GOOGLE_DRIVE_FOLDER_ID=12T5SpHRfmrDjom9HcH3LDl0J9P0oe3b5
GOOGLE_SPREADSHEET_ID=1YBhC5jsyStO3METamY2b-JOGgU-_wd-Q_7XPUBNDZ2E
```

#### **Step 1.2: Environment Configuration Standardization**
```typescript
// shared/utils/sbEnv.ts (ENHANCE EXISTING)
export interface SupabaseEnvConfig {
  url: string
  anonKey: string
  functionsBase: string
  schema?: string
  debug: boolean
}

export function readSbEnvOrThrow(): SupabaseEnvConfig {
  const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  const functionsBase = import.meta.env.VITE_SUPABASE_FUNCTIONS_BASE || process.env.SUPABASE_FUNCTIONS_BASE
  
  if (!url || !anonKey || !functionsBase) {
    throw new Error('[sbEnv] Missing required Supabase environment variables')
  }
  
  console.log(`[sbEnv] Environment loaded successfully for ${import.meta.env.MODE || 'development'}`)
  
  return {
    url,
    anonKey,
    functionsBase,
    schema: import.meta.env.VITE_SUPABASE_SCHEMA,
    debug: import.meta.env.VITE_DEBUG_MODE === 'true'
  }
}
```

#### **Step 1.3: Supabase Client Standardization**
```typescript
// Template for apps/*/src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { readSbEnvOrThrow } from '@shared/utils/sbEnv'

const env = readSbEnvOrThrow()

export const supabase = createClient(env.url, env.anonKey, {
  db: { 
    schema: env.schema || 'public' 
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false // Managed by Launcher
  },
  global: {
    headers: {
      'X-App-Origin': 'MODULE_NAME_HERE' // Replace per app
    }
  }
})

// Test connection on module load
supabase.from('_health_check')
  .select('*')
  .limit(1)
  .then(() => console.log('[supabase] Client connected successfully'))
  .catch((err) => console.warn('[supabase] Connection test failed:', err.message))

export default supabase
```

#### **Step 1.4: Connection Testing & Validation**
```typescript
// Create test utility: shared/utils/connectionTest.ts
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('test_connection')
      .select('now()')
      .limit(1)
    
    if (error) throw error
    
    console.log('[connectionTest] Supabase connection successful')
    return true
  } catch (error) {
    console.error('[connectionTest] Supabase connection failed:', error)
    return false
  }
}

export async function testEdgeFunctions(): Promise<boolean> {
  try {
    const response = await fetch(`${env.functionsBase}/test-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    })
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    console.log('[connectionTest] Edge Functions accessible')
    return true
  } catch (error) {
    console.error('[connectionTest] Edge Functions failed:', error)
    return false
  }
}
```

### **✅ Success Criteria (Must Pass ALL)**
- [ ] All 6 apps boot without environment variable errors
- [ ] Console shows `[sbEnv] Environment loaded successfully` in each app
- [ ] Console shows `[supabase] Client connected successfully` in each app
- [ ] Zero hardcoded Supabase URLs/keys remain in any source file
- [ ] TypeScript compilation passes without errors across all apps
- [ ] `npm run build:all` completes successfully
- [ ] Connection test returns true for both database and edge functions
- [ ] Apps maintain all existing functionality (visual regression test)

### **🚨 Fallback Plan**
```typescript
// Emergency fallback configuration
const EMERGENCY_CONFIG = {
  url: 'https://xaluaekioqwxtzhnmygg.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  functionsBase: 'https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1'
}

// If environment setup fails:
1. Revert all changes to working state
2. Use hardcoded emergency config temporarily  
3. Debug environment variable loading step by step
4. Test with single app before applying to all
5. Document exact error and resolution steps
```

---

## 🔐 PHASE 2: AUTHENTICATION ARCHITECTURE
**🎯 Goal**: Implement secure Single Sign-On across all modules with zero security vulnerabilities  
**⏱️ Duration**: 2-3 sessions (4-6 hours)  
**🔥 Priority**: HIGH - Required for all user-specific features

### **🎯 Mandatory Requirements (Non-Negotiable)**
1. ✅ **Launcher is the ONLY app that handles login/logout user interface**
2. ✅ **Modules NEVER show login prompts or forms**
3. ✅ **Use postMessage for secure token transfer with strict origin validation**
4. ✅ **No token passing via URLs, localStorage sharing, or cookies**
5. ✅ **All apps work gracefully in both authenticated and unauthenticated states**
6. ✅ **Session expiry handled automatically across all apps**

### **📋 Implementation Steps**

#### **Step 2.1: Launcher Authentication Provider**
```typescript
// apps/Launcher/src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import supabase from '../services/supabaseClient'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Propagate auth state to modules
        if (event === 'SIGNED_IN' && session) {
          broadcastSessionToModules(session)
        } else if (event === 'SIGNED_OUT') {
          broadcastSignOutToModules()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // signOut broadcast handled by onAuthStateChange
  }

  const refreshSession = async () => {
    const { data: { session } } = await supabase.auth.refreshSession()
    if (session) {
      broadcastSessionToModules(session)
    }
  }

  return (
    <AuthContext.Provider value={{
      user, session, loading, signIn, signOut, refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

#### **Step 2.2: Secure PostMessage Communication**
```typescript
// apps/Launcher/src/auth/ModuleCommunication.ts
interface AuthMessage {
  type: 'sb:hello' | 'sb:session' | 'sb:signout' | 'sb:error' | 'sb:ping'
  payload?: {
    access_token?: string
    refresh_token?: string  
    expires_at?: number
    user?: User
    error?: string
  }
  origin: string
  timestamp: number
  requestId: string
}

// Strict origin allowlist (NO wildcards)
const ALLOWED_ORIGINS = {
  development: [
    'http://localhost:5000', // Launcher
    'http://localhost:5001', // 0Setting
    'http://localhost:5002', // 1Meng
    'http://localhost:5003', // 3Database
    'http://localhost:5004', // 4Extra
    'http://localhost:5005'  // 5Rara
  ],
  production: [
    'https://launcher.yourdomain.com',
    'https://setting.yourdomain.com',
    'https://meng.yourdomain.com',
    'https://database.yourdomain.com',
    'https://extra.yourdomain.com',
    'https://rara.yourdomain.com'
  ]
}

function getAllowedOrigins(): string[] {
  return import.meta.env.MODE === 'production' 
    ? ALLOWED_ORIGINS.production 
    : ALLOWED_ORIGINS.development
}

function validateOrigin(origin: string): boolean {
  return getAllowedOrigins().includes(origin)
}

export function broadcastSessionToModules(session: Session) {
  const allowedOrigins = getAllowedOrigins()
  const message: AuthMessage = {
    type: 'sb:session',
    payload: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: session.user
    },
    origin: window.location.origin,
    timestamp: Date.now(),
    requestId: crypto.randomUUID()
  }

  // Send to all allowed origins
  allowedOrigins.forEach(origin => {
    if (origin !== window.location.origin) {
      try {
        window.postMessage(message, origin)
        console.log(`[auth] Session broadcasted to ${origin}`)
      } catch (error) {
        console.warn(`[auth] Failed to broadcast to ${origin}:`, error)
      }
    }
  })
}

export function broadcastSignOutToModules() {
  const allowedOrigins = getAllowedOrigins()
  const message: AuthMessage = {
    type: 'sb:signout',
    origin: window.location.origin,
    timestamp: Date.now(),
    requestId: crypto.randomUUID()
  }

  allowedOrigins.forEach(origin => {
    if (origin !== window.location.origin) {
      try {
        window.postMessage(message, origin)
        console.log(`[auth] Sign out broadcasted to ${origin}`)
      } catch (error) {
        console.warn(`[auth] Failed to broadcast signout to ${origin}:`, error)
      }
    }
  })
}

// Listen for module authentication requests
export function setupModuleAuthListener() {
  window.addEventListener('message', (event) => {
    if (!validateOrigin(event.origin)) {
      console.warn('[auth] Rejected message from unauthorized origin:', event.origin)
      return
    }

    const message = event.data as AuthMessage
    if (message.type === 'sb:hello') {
      // Module requesting current session
      const currentSession = supabase.auth.getSession()
      if (currentSession) {
        broadcastSessionToModules(currentSession)
      }
    }
  })
}
```

#### **Step 2.3: Module Authentication Listener**
```typescript
// shared/auth/ModuleAuthListener.ts (Used by all modules)
import { Session } from '@supabase/supabase-js'
import supabase from '../services/supabaseClient'

interface ModuleAuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  loading: boolean
}

export class ModuleAuthListener {
  private state: ModuleAuthState = {
    user: null,
    session: null,
    isAuthenticated: false,
    loading: true
  }
  
  private listeners = new Set<(state: ModuleAuthState) => void>()

  constructor() {
    this.setupMessageListener()
    this.requestSessionFromLauncher()
  }

  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      // Validate origin matches launcher
      if (!this.isValidLauncherOrigin(event.origin)) return

      const message = event.data as AuthMessage
      
      switch (message.type) {
        case 'sb:session':
          this.handleSessionReceived(message.payload)
          break
        case 'sb:signout':
          this.handleSignOut()
          break
      }
    })
  }

  private requestSessionFromLauncher() {
    // Request current session from launcher
    const message: AuthMessage = {
      type: 'sb:hello',
      origin: window.location.origin,
      timestamp: Date.now(),
      requestId: crypto.randomUUID()
    }

    // Try to reach launcher on different possible origins
    const launcherOrigins = this.getPossibleLauncherOrigins()
    launcherOrigins.forEach(origin => {
      try {
        window.parent.postMessage(message, origin)
      } catch (error) {
        // Expected for most attempts, launcher will respond from correct origin
      }
    })

    // Set timeout for auth loading
    setTimeout(() => {
      if (this.state.loading) {
        this.updateState({ loading: false })
      }
    }, 5000)
  }

  private async handleSessionReceived(payload: any) {
    try {
      const { error } = await supabase.auth.setSession({
        access_token: payload.access_token,
        refresh_token: payload.refresh_token
      })

      if (error) throw error

      this.updateState({
        user: payload.user,
        session: { ...payload },
        isAuthenticated: true,
        loading: false
      })

      console.log('[moduleAuth] Session established successfully')
    } catch (error) {
      console.error('[moduleAuth] Failed to set session:', error)
      this.updateState({ loading: false })
    }
  }

  private async handleSignOut() {
    await supabase.auth.signOut()
    this.updateState({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false
    })
    console.log('[moduleAuth] Signed out')
  }

  public subscribe(listener: (state: ModuleAuthState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  public getState(): ModuleAuthState {
    return { ...this.state }
  }

  private updateState(updates: Partial<ModuleAuthState>) {
    this.state = { ...this.state, ...updates }
    this.listeners.forEach(listener => listener(this.state))
  }
}

// React hook for modules
export function useModuleAuth() {
  const [authState, setAuthState] = useState<ModuleAuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    loading: true
  })

  useEffect(() => {
    const authListener = new ModuleAuthListener()
    
    const unsubscribe = authListener.subscribe(setAuthState)
    setAuthState(authListener.getState())

    return unsubscribe
  }, [])

  return authState
}
```

#### **Step 2.4: Session Management & Auto-Refresh**
```typescript
// shared/auth/SessionManager.ts
export class SessionManager {
  private refreshTimer: number | null = null
  private readonly REFRESH_MARGIN = 5 * 60 * 1000 // 5 minutes before expiry

  constructor(private isLauncher: boolean = false) {
    this.setupAutoRefresh()
  }

  private setupAutoRefresh() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.expires_at) {
        this.scheduleRefresh(session.expires_at)
      } else {
        this.clearRefreshTimer()
      }
    })
  }

  private scheduleRefresh(expiresAt: number) {
    this.clearRefreshTimer()
    
    const now = Date.now() / 1000
    const timeUntilRefresh = (expiresAt - now) * 1000 - this.REFRESH_MARGIN
    
    if (timeUntilRefresh > 0) {
      this.refreshTimer = window.setTimeout(() => {
        this.refreshSession()
      }, timeUntilRefresh)
      
      console.log(`[sessionManager] Refresh scheduled in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`)
    } else {
      // Token already expired or close to expiry
      this.refreshSession()
    }
  }

  private async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) throw error
      
      console.log('[sessionManager] Session refreshed successfully')
      
      // If this is launcher, broadcast new session to modules
      if (this.isLauncher && data.session) {
        broadcastSessionToModules(data.session)
      }
    } catch (error) {
      console.error('[sessionManager] Failed to refresh session:', error)
      // Handle refresh failure (redirect to login, etc.)
    }
  }

  private clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  public destroy() {
    this.clearRefreshTimer()
  }
}
```

### **✅ Success Criteria (Must Pass ALL)**
- [ ] Login in Launcher authenticates user across all 6 modules within 2 seconds
- [ ] Logout in Launcher signs out all modules within 2 seconds  
- [ ] Modules work correctly when opened independently (show unauthenticated state)
- [ ] No authentication prompts or login forms appear in any module
- [ ] Token transfer happens securely via postMessage (verified in Network tab)
- [ ] Origin validation prevents unauthorized access (test with fake origins)
- [ ] Session persistence works across browser refreshes in all apps
- [ ] Auto-refresh works and propagates to modules before token expiry
- [ ] All apps handle loading states during authentication properly
- [ ] No tokens visible in localStorage, sessionStorage, or URLs

### **🚨 Fallback Plan**
```typescript
// Emergency: Independent auth per module
const AUTH_FALLBACK_MODE = true
if (AUTH_FALLBACK_MODE) {
  // Each module handles own auth
  // Show login forms in modules
  // Use localStorage for session sharing
  // Disable cross-module communication
}

// Steps if authentication integration fails:
1. Disable cross-module auth, keep apps working independently
2. Implement simple localStorage token sharing as temporary measure
3. Fall back to per-app authentication with login forms
4. Use test-submit endpoint for development without auth
5. Document exact failure point and error messages
```

---

## 🔌 PHASE 3: API INTEGRATION LAYER
**🎯 Goal**: Create robust, typed API wrappers with comprehensive error handling  
**⏱️ Duration**: 2-3 sessions (4-6 hours)  
**🔥 Priority**: HIGH - Core backend functionality depends on this

### **🎯 Mandatory Requirements (Non-Negotiable)**
1. ✅ **All API calls must include comprehensive error handling and user feedback**
2. ✅ **Implement exponential backoff retry logic for transient failures**
3. ✅ **Never expose service role key or internal tokens**
4. ✅ **Provide graceful degradation for offline scenarios**
5. ✅ **Type ALL API requests, responses, and error states**
6. ✅ **Include request/response logging for debugging**
7. ✅ **Implement optimistic updates where appropriate**

### **📋 Implementation Steps**

#### **Step 3.1: Enhanced API Client Foundation**
```typescript
// shared/api/ApiClient.ts
import { readSbEnvOrThrow } from '../utils/sbEnv'

export interface ApiRequestOptions extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
  skipAuth?: boolean
  optimistic?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
    retryable: boolean
  }
  metadata?: {
    timestamp: string
    request_id: string
    processing_time_ms: number
  }
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public retryable: boolean = false,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private baseUrl: string
  private getAccessToken: () => Promise<string | null>
  private defaultTimeout = 30000
  private maxRetries = 3

  constructor(getAccessToken: () => Promise<string | null>) {
    const env = readSbEnvOrThrow()
    this.baseUrl = env.functionsBase
    this.getAccessToken = getAccessToken
  }

  async call<T = any>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const requestId = crypto.randomUUID()
    const startTime = Date.now()

    try {
      const response = await this.executeWithRetry(endpoint, options, requestId)
      const data = await response.json()
      
      const processingTime = Date.now() - startTime
      
      if (options.optimistic && response.ok) {
        console.log(`[apiClient] Optimistic request completed: ${endpoint} (${processingTime}ms)`)
      }

      if (!response.ok) {
        throw new ApiError(
          data.error?.code || 'HTTP_ERROR',
          data.error?.message || `HTTP ${response.status}`,
          response.status,
          this.isRetryableStatus(response.status),
          data.error?.details
        )
      }

      return {
        success: true,
        data: data.data || data,
        metadata: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
          processing_time_ms: processingTime
        }
      }
    } catch (error) {
      console.error(`[apiClient] Request failed: ${endpoint}`, error)
      
      if (error instanceof ApiError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            retryable: error.retryable
          }
        }
      }

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network request failed',
          retryable: true
        }
      }
    }
  }

  private async executeWithRetry(
    endpoint: string,
    options: ApiRequestOptions,
    requestId: string
  ): Promise<Response> {
    const maxRetries = options.retries ?? this.maxRetries
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = this.calculateRetryDelay(attempt, options.retryDelay)
          await this.sleep(delay)
          console.log(`[apiClient] Retry attempt ${attempt}/${maxRetries} for ${endpoint}`)
        }

        return await this.executeRequest(endpoint, options, requestId)
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries || !this.shouldRetry(error)) {
          throw error
        }
      }
    }

    throw lastError!
  }

  private async executeRequest(
    endpoint: string,
    options: ApiRequestOptions,
    requestId: string
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`
    const timeout = options.timeout ?? this.defaultTimeout
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...options.headers as Record<string, string>
    }

    // Add authentication if not skipped
    if (!options.skipAuth) {
      const token = await this.getAccessToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new ApiError('TIMEOUT', 'Request timeout', 408, true)
      }
      
      throw error
    }
  }

  private calculateRetryDelay(attempt: number, baseDelay: number = 1000): number {
    // Exponential backoff with jitter
    const exponential = baseDelay * Math.pow(2, attempt - 1)
    const jitter = Math.random() * 0.3 * exponential
    return Math.min(exponential + jitter, 10000) // Max 10 seconds
  }

  private shouldRetry(error: any): boolean {
    if (error instanceof ApiError) {
      return error.retryable
    }
    
    // Retry network errors, timeouts, and 5xx errors
    return error.name === 'AbortError' || 
           error.message?.includes('fetch') ||
           error.message?.includes('network')
  }

  private isRetryableStatus(status: number): boolean {
    // 5xx server errors and 429 rate limiting are retryable
    return status >= 500 || status === 429
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

#### **Step 3.2: User Hub API Wrapper**
```typescript
// shared/api/UserHubApi.ts
export interface ConfigData {
  [key: string]: any
}

export interface SubmissionResult {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  timestamp: string
}

export interface AssetInfo {
  id: string
  name: string
  type: string
  size: number
  url: string
  created_at: string
}

export interface AssetMetadata {
  name: string
  type: string
  path: string
  size: number
  mimeType: string
  metadata?: Record<string, any>
}

export interface UserAnalytics {
  configs: number
  submissions: number
  assets: number
  last_activity: number
  breakdown: {
    config_types: Record<string, number>
    submission_modules: Record<string, number>
    asset_types: Record<string, number>
  }
}

export class UserHubApi extends ApiClient {
  // Config Sync (Two-way synchronization)
  async pullConfig(
    type: 'settings' | 'sync-data', 
    profile: string = 'default'
  ): Promise<ConfigData | null> {
    const response = await this.call<ConfigData>(
      `/user-hub/${type}?profile=${encodeURIComponent(profile)}`
    )
    
    if (!response.success) {
      if (response.error?.code === 'NOT_FOUND') {
        return null // No config exists yet
      }
      throw new ApiError(
        response.error?.code || 'CONFIG_PULL_FAILED',
        response.error?.message || 'Failed to load configuration',
        500,
        response.error?.retryable || false
      )
    }
    
    return response.data || null
  }

  async pushConfig(
    type: 'settings' | 'sync-data',
    data: ConfigData,
    profile: string = 'default'
  ): Promise<void> {
    const response = await this.call<void>(`/user-hub/${type}`, {
      method: 'POST',
      body: JSON.stringify({ ...data, profile }),
      optimistic: true
    })
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'CONFIG_PUSH_FAILED',
        response.error?.message || 'Failed to save configuration',
        500,
        response.error?.retryable || false
      )
    }
  }

  async deleteConfig(
    type: 'settings' | 'sync-data',
    profile: string = 'default'
  ): Promise<void> {
    const response = await this.call<void>(
      `/user-hub/${type}?profile=${encodeURIComponent(profile)}`,
      { method: 'DELETE' }
    )
    
    if (!response.success && response.error?.code !== 'NOT_FOUND') {
      throw new ApiError(
        response.error?.code || 'CONFIG_DELETE_FAILED',
        response.error?.message || 'Failed to delete configuration',
        500,
        response.error?.retryable || false
      )
    }
  }

  // Form Submissions (One-way)
  async submitForm(moduleId: string, formData: any): Promise<SubmissionResult> {
    const response = await this.call<SubmissionResult>(
      `/user-hub/${moduleId}/submit`,
      {
        method: 'POST',
        body: JSON.stringify(formData),
        timeout: 45000 // Longer timeout for form processing
      }
    )
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'FORM_SUBMIT_FAILED',
        response.error?.message || 'Failed to submit form',
        500,
        response.error?.retryable || false,
        response.error?.details
      )
    }
    
    return response.data!
  }

  // Asset Management
  async listAssets(type?: string, limit: number = 50): Promise<AssetInfo[]> {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    params.set('limit', limit.toString())
    
    const response = await this.call<AssetInfo[]>(
      `/user-hub/assets?${params.toString()}`
    )
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'ASSETS_LIST_FAILED',
        response.error?.message || 'Failed to load assets',
        500,
        response.error?.retryable || false
      )
    }
    
    return response.data || []
  }

  async saveAssetMetadata(metadata: AssetMetadata): Promise<string> {
    const response = await this.call<{ id: string }>('/user-hub/assets', {
      method: 'POST',
      body: JSON.stringify(metadata)
    })
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'ASSET_SAVE_FAILED',
        response.error?.message || 'Failed to save asset metadata',
        500,
        response.error?.retryable || false
      )
    }
    
    return response.data!.id
  }

  async deleteAsset(assetId: string): Promise<void> {
    const response = await this.call<void>(`/user-hub/assets/${assetId}`, {
      method: 'DELETE'
    })
    
    if (!response.success && response.error?.code !== 'NOT_FOUND') {
      throw new ApiError(
        response.error?.code || 'ASSET_DELETE_FAILED',
        response.error?.message || 'Failed to delete asset',
        500,
        response.error?.retryable || false
      )
    }
  }

  // Analytics
  async getAnalytics(): Promise<UserAnalytics> {
    const response = await this.call<UserAnalytics>('/user-hub/analytics')
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'ANALYTICS_FAILED',
        response.error?.message || 'Failed to load analytics',
        500,
        response.error?.retryable || false
      )
    }
    
    return response.data!
  }
}
```

#### **Step 3.3: Module-Specific API Wrappers**
```typescript
// apps/1Meng/src/api/MengApi.ts
export interface ReceiptData {
  amount: number
  description: string
  category: string
  date: string
  receipt_image?: File
  vendor?: string
  tags?: string[]
}

export interface MengSyncData {
  receipts: ReceiptData[]
  categories: string[]
  settings: Record<string, any>
  last_sync: string
}

export class MengApi extends ApiClient {
  async submitReceipt(receiptData: ReceiptData): Promise<string> {
    const response = await this.call<{ id: string }>('/meng-receipt', {
      method: 'POST',
      body: JSON.stringify(receiptData),
      timeout: 60000 // Longer timeout for image processing
    })
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'RECEIPT_SUBMIT_FAILED',
        response.error?.message || 'Failed to submit receipt',
        500,
        response.error?.retryable || false
      )
    }
    
    return response.data!.id
  }

  async syncData(data: MengSyncData): Promise<void> {
    const response = await this.call<void>('/meng-sync', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'MENG_SYNC_FAILED',
        response.error?.message || 'Failed to sync Meng data',
        500,
        response.error?.retryable || false
      )
    }
  }
}

// apps/5Rara/src/api/RaraApi.ts
export interface ClockData {
  timestamp?: Date
  location?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  notes?: string
}

export class RaraApi extends ApiClient {
  async clockIn(data: ClockData = {}): Promise<void> {
    const payload = {
      timestamp: data.timestamp?.toISOString() || new Date().toISOString(),
      location: data.location,
      notes: data.notes
    }
    
    const response = await this.call<void>('/rara-clockin', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'CLOCK_IN_FAILED',
        response.error?.message || 'Failed to clock in',
        500,
        response.error?.retryable || false
      )
    }
  }

  async clockOut(data: ClockData = {}): Promise<void> {
    const payload = {
      timestamp: data.timestamp?.toISOString() || new Date().toISOString(),
      location: data.location,
      notes: data.notes
    }
    
    const response = await this.call<void>('/rara-clockout', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'CLOCK_OUT_FAILED',
        response.error?.message || 'Failed to clock out',
        500,
        response.error?.retryable || false
      )
    }
  }
}

// apps/3Database/src/api/DatabaseApi.ts
export interface DatabaseStats {
  table_count: number
  row_count: number
  size_bytes: number
  last_backup: string
  health: 'healthy' | 'warning' | 'critical'
}

export class DatabaseApi extends ApiClient {
  async getStats(): Promise<DatabaseStats> {
    const response = await this.call<DatabaseStats>('/database-stats')
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'DB_STATS_FAILED',
        response.error?.message || 'Failed to get database statistics',
        500,
        response.error?.retryable || false
      )
    }
    
    return response.data!
  }

  async exportDatabase(): Promise<Blob> {
    const response = await this.call<ArrayBuffer>('/database-export', {
      timeout: 120000 // 2 minutes for export
    })
    
    if (!response.success) {
      throw new ApiError(
        response.error?.code || 'DB_EXPORT_FAILED',
        response.error?.message || 'Failed to export database',
        500,
        response.error?.retryable || false
      )
    }
    
    return new Blob([response.data!], { type: 'application/sql' })
  }
}
```

#### **Step 3.4: Offline Support & Caching**
```typescript
// shared/api/OfflineManager.ts
interface CachedResponse<T> {
  data: T
  timestamp: number
  etag?: string
}

interface PendingRequest {
  id: string
  endpoint: string
  options: ApiRequestOptions
  data: any
  timestamp: number
  retries: number
}

export class OfflineManager {
  private cache = new Map<string, CachedResponse<any>>()
  private pendingRequests: PendingRequest[] = []
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_PENDING = 100

  constructor() {
    this.loadFromStorage()
    this.setupOnlineListener()
  }

  // Cache management
  setCachedResponse<T>(key: string, data: T, etag?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag
    })
    this.saveToStorage()
  }

  getCachedResponse<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key)
      this.saveToStorage()
      return null
    }
    
    return cached.data
  }

  // Offline request queuing
  queueRequest(endpoint: string, options: ApiRequestOptions, data: any): string {
    if (this.pendingRequests.length >= this.MAX_PENDING) {
      // Remove oldest request
      this.pendingRequests.shift()
    }
    
    const request: PendingRequest = {
      id: crypto.randomUUID(),
      endpoint,
      options,
      data,
      timestamp: Date.now(),
      retries: 0
    }
    
    this.pendingRequests.push(request)
    this.saveToStorage()
    
    console.log(`[offline] Queued request: ${endpoint}`)
    return request.id
  }

  async processPendingRequests(apiClient: ApiClient): Promise<void> {
    if (!navigator.onLine || this.pendingRequests.length === 0) return
    
    console.log(`[offline] Processing ${this.pendingRequests.length} pending requests`)
    
    const requests = [...this.pendingRequests]
    this.pendingRequests = []
    
    for (const request of requests) {
      try {
        await apiClient.call(request.endpoint, {
          ...request.options,
          body: JSON.stringify(request.data)
        })
        
        console.log(`[offline] Successfully processed: ${request.endpoint}`)
      } catch (error) {
        request.retries++
        
        if (request.retries < 3) {
          this.pendingRequests.push(request)
          console.log(`[offline] Requeued failed request: ${request.endpoint} (retry ${request.retries})`)
        } else {
          console.error(`[offline] Discarded failed request after 3 retries: ${request.endpoint}`)
        }
      }
    }
    
    this.saveToStorage()
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      console.log('[offline] Connection restored, processing pending requests')
      // Trigger pending request processing (needs ApiClient instance)
    })
  }

  private loadFromStorage(): void {
    try {
      const cached = localStorage.getItem('offline_cache')
      if (cached) {
        const data = JSON.parse(cached)
        this.cache = new Map(data.cache || [])
        this.pendingRequests = data.pending || []
      }
    } catch (error) {
      console.warn('[offline] Failed to load cache from storage:', error)
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        pending: this.pendingRequests
      }
      localStorage.setItem('offline_cache', JSON.stringify(data))
    } catch (error) {
      console.warn('[offline] Failed to save cache to storage:', error)
    }
  }

  public clearCache(): void {
    this.cache.clear()
    this.pendingRequests = []
    localStorage.removeItem('offline_cache')
  }
}
```

### **✅ Success Criteria (Must Pass ALL)**
- [ ] Test call to `/functions/v1/user-hub/analytics` returns 200 with valid auth token
- [ ] Test call without auth returns 401 (not 500 or other error)
- [ ] Config sync roundtrip works: save settings, reload page, verify persistence
- [ ] Form submission completes successfully and returns valid tracking ID
- [ ] Error mapping works correctly (network errors → user-friendly messages)
- [ ] Retry logic activates on 5xx errors and network failures (verify in logs)
- [ ] Offline scenario handled gracefully (disable network, verify queue)
- [ ] TypeScript compilation passes with no type errors for all API interfaces
- [ ] API response times average < 2 seconds under normal conditions
- [ ] Cache invalidation works correctly (old data not returned after TTL)

### **🚨 Fallback Plan**
```typescript
// Emergency: Disable API integration
const API_INTEGRATION_DISABLED = true
if (API_INTEGRATION_DISABLED) {
  // Use localStorage for all data operations
  // Mock successful API responses
  // Show "offline mode" indicator
  // Queue operations for later sync
}

// Steps if API integration fails:
1. Disable problematic endpoints while keeping working ones
2. Use mock data with localStorage persistence
3. Implement basic fetch calls without retry logic
4. Use direct Supabase client calls as fallback
5. Document specific failures and test manually
```

---

## 🎮 PHASE 4: MODULE-SPECIFIC INTEGRATION
**🎯 Goal**: Connect each app to its relevant backend services with full functionality  
**⏱️ Duration**: 4-5 sessions (8-10 hours)  
**🔥 Priority**: MEDIUM - Enhanced functionality per module

### **🎯 Mandatory Requirements (Non-Negotiable)**
1. ✅ **Each module must work independently (no cross-dependencies between modules)**
2. ✅ **Preserve ALL existing UI/UX behavior and visual elements**
3. ✅ **Implement progressive enhancement (graceful degradation without backend)**
4. ✅ **Add comprehensive loading states and error handling to all forms**
5. ✅ **No breaking changes to existing functionality**
6. ✅ **Each integration must be testable independently**
7. ✅ **Performance impact must be minimal (< 500ms additional load time)**

### **📋 Implementation Steps**

#### **Step 4.1: 0Setting - System Configuration Management**
```typescript
// apps/0Setting/src/hooks/useSettings.ts
interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'en' | 'id' | 'zh'
  notifications: boolean
  autoSave: boolean
  compactMode: boolean
  animations: boolean
  [key: string]: any
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  
  const { isAuthenticated } = useModuleAuth()
  const userHubApi = useMemo(() => new UserHubApi(getAccessToken), [])

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [isAuthenticated])

  const loadSettings = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let settingsData: AppSettings
      
      if (isAuthenticated) {
        // Try to load from backend
        const cloudSettings = await userHubApi.pullConfig('settings')
        if (cloudSettings) {
          settingsData = { ...DEFAULT_SETTINGS, ...cloudSettings }
          setLastSync(new Date())
        } else {
          // No cloud settings, use local or defaults
          settingsData = loadLocalSettings() || DEFAULT_SETTINGS
        }
      } else {
        // Load from localStorage when not authenticated
        settingsData = loadLocalSettings() || DEFAULT_SETTINGS
      }
      
      setSettings(settingsData)
      saveLocalSettings(settingsData) // Always cache locally
    } catch (error) {
      console.error('[settings] Failed to load settings:', error)
      setError('Failed to load settings')
      
      // Fallback to local settings
      const localSettings = loadLocalSettings() || DEFAULT_SETTINGS
      setSettings(localSettings)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<AppSettings>) => {
    if (!settings) return
    
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    saveLocalSettings(newSettings) // Optimistic local update
    
    if (isAuthenticated) {
      try {
        await userHubApi.pushConfig('settings', newSettings)
        setLastSync(new Date())
        setError(null)
      } catch (error) {
        console.error('[settings] Failed to sync settings:', error)
        setError('Settings saved locally, will sync when connection is restored')
        // Keep local changes, will retry later
      }
    }
  }

  const resetSettings = async () => {
    const defaultSettings = { ...DEFAULT_SETTINGS }
    setSettings(defaultSettings)
    saveLocalSettings(defaultSettings)
    
    if (isAuthenticated) {
      try {
        await userHubApi.deleteConfig('settings')
        setLastSync(new Date())
        setError(null)
      } catch (error) {
        console.error('[settings] Failed to reset cloud settings:', error)
        setError('Settings reset locally, cloud settings will be cleared when connection is restored')
      }
    }
  }

  const exportSettings = () => {
    if (!settings) return
    
    const exportData = {
      settings,
      exported_at: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importSettings = async (file: File) => {
    try {
      const text = await file.text()
      const importData = JSON.parse(text)
      
      if (importData.settings) {
        await updateSettings(importData.settings)
        return { success: true }
      } else {
        throw new Error('Invalid settings file format')
      }
    } catch (error) {
      console.error('[settings] Failed to import settings:', error)
      return { success: false, error: 'Invalid settings file' }
    }
  }

  return {
    settings,
    loading,
    error,
    lastSync,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    reload: loadSettings
  }
}

// Helper functions
function loadLocalSettings(): AppSettings | null {
  try {
    const stored = localStorage.getItem('app_settings')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function saveLocalSettings(settings: AppSettings): void {
  try {
    localStorage.setItem('app_settings', JSON.stringify(settings))
  } catch (error) {
    console.warn('[settings] Failed to save to localStorage:', error)
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'en',
  notifications: true,
  autoSave: true,
  compactMode: false,
  animations: true
}
```

**Success Criteria for 0Setting:**
- [ ] Settings persist across browser sessions and device restarts
- [ ] Changes sync to cloud within 5 seconds when authenticated
- [ ] Offline changes are queued and sync when connection restored
- [ ] Export/import functionality works with valid JSON files
- [ ] Reset to defaults function works correctly
- [ ] UI shows sync status and last sync time
- [ ] Module works fully when unauthenticated (local storage only)

#### **Step 4.2: 1Meng - Receipt Management & Submissions**
```typescript
// apps/1Meng/src/hooks/useReceipts.ts
interface Receipt {
  id?: string
  amount: number
  description: string
  category: string
  date: string
  vendor?: string
  tags: string[]
  receipt_image?: File | string
  status: 'draft' | 'submitted' | 'synced' | 'failed'
  created_at: string
  synced_at?: string
}

export function useReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const { isAuthenticated } = useModuleAuth()
  const mengApi = useMemo(() => new MengApi(getAccessToken), [])

  useEffect(() => {
    loadReceipts()
    loadCategories()
  }, [])

  const submitReceipt = async (receiptData: Omit<Receipt, 'id' | 'status' | 'created_at'>): Promise<string> => {
    setSubmitting(true)
    
    const receipt: Receipt = {
      ...receiptData,
      id: crypto.randomUUID(),
      status: 'draft',
      created_at: new Date().toISOString()
    }
    
    // Optimistic update
    setReceipts(prev => [receipt, ...prev])
    saveReceiptsLocally([receipt, ...receipts])
    
    try {
      if (isAuthenticated) {
        const submissionId = await mengApi.submitReceipt(receiptData)
        
        // Update receipt status
        const submittedReceipt = {
          ...receipt,
          id: submissionId,
          status: 'submitted' as const,
          synced_at: new Date().toISOString()
        }
        
        setReceipts(prev => 
          prev.map(r => r.id === receipt.id ? submittedReceipt : r)
        )
        saveReceiptsLocally(receipts.map(r => r.id === receipt.id ? submittedReceipt : r))
        
        // Add category if new
        if (!categories.includes(receiptData.category)) {
          const newCategories = [...categories, receiptData.category]
          setCategories(newCategories)
          saveCategoriesLocally(newCategories)
        }
        
        return submissionId
      } else {
        // Save locally for later sync
        console.log('[receipts] Saved locally, will sync when authenticated')
        return receipt.id!
      }
    } catch (error) {
      console.error('[receipts] Failed to submit receipt:', error)
      
      // Update status to failed
      const failedReceipt = { ...receipt, status: 'failed' as const }
      setReceipts(prev => 
        prev.map(r => r.id === receipt.id ? failedReceipt : r)
      )
      
      throw new Error('Failed to submit receipt. It has been saved locally and will be retried.')
    } finally {
      setSubmitting(false)
    }
  }

  const retryFailedReceipts = async () => {
    const failedReceipts = receipts.filter(r => r.status === 'failed')
    
    for (const receipt of failedReceipts) {
      try {
        const submissionId = await mengApi.submitReceipt(receipt)
        
        const updatedReceipt = {
          ...receipt,
          id: submissionId,
          status: 'submitted' as const,
          synced_at: new Date().toISOString()
        }
        
        setReceipts(prev => 
          prev.map(r => r.id === receipt.id ? updatedReceipt : r)
        )
      } catch (error) {
        console.error(`[receipts] Failed to retry receipt ${receipt.id}:`, error)
      }
    }
  }

  const deleteReceipt = (receiptId: string) => {
    setReceipts(prev => prev.filter(r => r.id !== receiptId))
    saveReceiptsLocally(receipts.filter(r => r.id !== receiptId))
  }

  const getReceiptsByCategory = (category: string) => {
    return receipts.filter(r => r.category === category)
  }

  const getTotalAmount = (category?: string) => {
    const filteredReceipts = category 
      ? receipts.filter(r => r.category === category)
      : receipts
    
    return filteredReceipts.reduce((sum, r) => sum + r.amount, 0)
  }

  return {
    receipts,
    categories,
    loading,
    submitting,
    submitReceipt,
    retryFailedReceipts,
    deleteReceipt,
    getReceiptsByCategory,
    getTotalAmount
  }
}

// Local storage helpers
function saveReceiptsLocally(receipts: Receipt[]) {
  try {
    localStorage.setItem('meng_receipts', JSON.stringify(receipts))
  } catch (error) {
    console.warn('[receipts] Failed to save locally:', error)
  }
}

function loadReceiptsLocally(): Receipt[] {
  try {
    const stored = localStorage.getItem('meng_receipts')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
```

**Success Criteria for 1Meng:**
- [ ] Receipt form submits successfully to `/meng-receipt` endpoint
- [ ] Data appears in Google Spreadsheet within 30 seconds of submission
- [ ] File uploads work and metadata is saved correctly
- [ ] Failed submissions are retried automatically when connection restored
- [ ] Analytics dashboard shows submission counts and spending trends
- [ ] Offline receipts are queued and sync when authenticated
- [ ] Categories are managed dynamically based on submissions

#### **Step 4.3: 3Database - Database Monitoring & Management**
```typescript
// apps/3Database/src/hooks/useDatabase.ts
export function useDatabase() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  
  const { isAuthenticated } = useModuleAuth()
  const dbApi = useMemo(() => new DatabaseApi(getAccessToken), [])

  useEffect(() => {
    if (isAuthenticated) {
      refreshStats()
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(refreshStats, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const refreshStats = async () => {
    if (!isAuthenticated) return
    
    try {
      const newStats = await dbApi.getStats()
      setStats(newStats)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('[database] Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportDatabase = async () => {
    if (!isAuthenticated) return
    
    setExporting(true)
    
    try {
      const blob = await dbApi.exportDatabase()
      
      // Download the export file
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `database-export-${new Date().toISOString().split('T')[0]}.sql`
      a.click()
      URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      console.error('[database] Export failed:', error)
      return { success: false, error: 'Export failed' }
    } finally {
      setExporting(false)
    }
  }

  return {
    stats,
    loading,
    exporting,
    lastRefresh,
    refreshStats,
    exportDatabase,
    isHealthy: stats?.health === 'healthy'
  }
}
```

**Success Criteria for 3Database:**
- [ ] Database statistics refresh automatically every 30 seconds
- [ ] Export functionality generates valid SQL file downloads
- [ ] Health status displays correctly (healthy/warning/critical)
- [ ] Performance metrics update in real-time
- [ ] Module gracefully handles database connection issues
- [ ] Statistics show accurate table counts, row counts, and sizes

#### **Step 4.4: 5Rara - Time Tracking & Clock Management**
```typescript
// apps/5Rara/src/hooks/useTimeTracking.ts
interface TimeEntry {
  id: string
  clock_in: string
  clock_out?: string
  duration?: number
  location?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  notes?: string
  status: 'clocked_in' | 'clocked_out' | 'pending_sync'
}

export function useTimeTracking() {
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [clockingIn, setClockingIn] = useState(false)
  const [clockingOut, setClockingOut] = useState(false)
  
  const { isAuthenticated } = useModuleAuth()
  const raraApi = useMemo(() => new RaraApi(getAccessToken), [])

  useEffect(() => {
    loadTimeEntries()
  }, [])

  const clockIn = async (notes?: string) => {
    setClockingIn(true)
    
    try {
      const location = await getCurrentLocation()
      const timestamp = new Date()
      
      const entry: TimeEntry = {
        id: crypto.randomUUID(),
        clock_in: timestamp.toISOString(),
        location,
        notes,
        status: 'clocked_in'
      }
      
      if (isAuthenticated) {
        await raraApi.clockIn({ timestamp, location, notes })
        entry.status = 'clocked_in'
      } else {
        entry.status = 'pending_sync'
      }
      
      setCurrentEntry(entry)
      setTimeEntries(prev => [entry, ...prev])
      saveTimeEntriesLocally([entry, ...timeEntries])
      
    } catch (error) {
      console.error('[timeTracking] Clock in failed:', error)
      throw new Error('Failed to clock in')
    } finally {
      setClockingIn(false)
    }
  }

  const clockOut = async (notes?: string) => {
    if (!currentEntry) return
    
    setClockingOut(true)
    
    try {
      const location = await getCurrentLocation()
      const timestamp = new Date()
      const clockInTime = new Date(currentEntry.clock_in)
      const duration = timestamp.getTime() - clockInTime.getTime()
      
      const updatedEntry: TimeEntry = {
        ...currentEntry,
        clock_out: timestamp.toISOString(),
        duration,
        location,
        notes: notes || currentEntry.notes,
        status: 'clocked_out'
      }
      
      if (isAuthenticated) {
        await raraApi.clockOut({ timestamp, location, notes })
        updatedEntry.status = 'clocked_out'
      } else {
        updatedEntry.status = 'pending_sync'
      }
      
      setCurrentEntry(null)
      setTimeEntries(prev => 
        prev.map(entry => 
          entry.id === currentEntry.id ? updatedEntry : entry
        )
      )
      
      saveTimeEntriesLocally(
        timeEntries.map(entry => 
          entry.id === currentEntry.id ? updatedEntry : entry
        )
      )
      
    } catch (error) {
      console.error('[timeTracking] Clock out failed:', error)
      throw new Error('Failed to clock out')
    } finally {
      setClockingOut(false)
    }
  }

  const getCurrentDuration = (): number => {
    if (!currentEntry) return 0
    
    const now = new Date()
    const clockInTime = new Date(currentEntry.clock_in)
    return now.getTime() - clockInTime.getTime()
  }

  const getDayTotal = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0]
    
    return timeEntries
      .filter(entry => 
        entry.clock_in.startsWith(dateStr) && 
        entry.duration && 
        entry.status === 'clocked_out'
      )
      .reduce((total, entry) => total + (entry.duration || 0), 0)
  }

  const getWeekTotal = (weekStart: Date): number => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    
    return timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.clock_in)
        return entryDate >= weekStart && 
               entryDate < weekEnd && 
               entry.duration && 
               entry.status === 'clocked_out'
      })
      .reduce((total, entry) => total + (entry.duration || 0), 0)
  }

  return {
    currentEntry,
    timeEntries,
    clockingIn,
    clockingOut,
    isActive: !!currentEntry,
    clockIn,
    clockOut,
    getCurrentDuration,
    getDayTotal,
    getWeekTotal
  }
}

async function getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy: number } | undefined> {
  if (!navigator.geolocation) return undefined
  
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    })
    
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    }
  } catch (error) {
    console.warn('[timeTracking] Failed to get location:', error)
    return undefined
  }
}
```

**Success Criteria for 5Rara:**
- [ ] Clock in/out timestamps save correctly to backend
- [ ] Time calculations are accurate to the minute
- [ ] Daily and weekly reports generate correctly for specified date ranges
- [ ] Location data is captured when permission is granted
- [ ] Offline clock in/out events are queued and sync when connected
- [ ] Current session time displays and updates in real-time

#### **Step 4.5: 4Extra - Personal Applications & Custom Features**
```typescript
// apps/4Extra/src/hooks/usePersonalData.ts
export function usePersonalData() {
  const [notes, setNotes] = useState<PersonalNote[]>([])
  const [customForms, setCustomForms] = useState<CustomForm[]>([])
  const [assets, setAssets] = useState<AssetInfo[]>([])
  
  const { isAuthenticated } = useModuleAuth()
  const userHubApi = useMemo(() => new UserHubApi(getAccessToken), [])

  const saveNote = async (noteData: Omit<PersonalNote, 'id' | 'created_at'>) => {
    const note: PersonalNote = {
      ...noteData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }
    
    // Optimistic update
    setNotes(prev => [note, ...prev])
    
    if (isAuthenticated) {
      try {
        await userHubApi.pushConfig('sync-data', { notes: [note, ...notes] })
      } catch (error) {
        console.error('[personalData] Failed to sync note:', error)
      }
    }
    
    return note.id
  }

  const submitCustomForm = async (formId: string, formData: any) => {
    if (isAuthenticated) {
      return await userHubApi.submitForm('4extra', { formId, data: formData })
    } else {
      // Queue for later submission
      console.log('[personalData] Form queued for sync when authenticated')
      return crypto.randomUUID()
    }
  }

  return {
    notes,
    customForms,
    assets,
    saveNote,
    submitCustomForm
  }
}
```

**Success Criteria for 4Extra:**
- [ ] Personal notes sync across devices within 5 seconds
- [ ] Custom form builder creates and submits forms successfully
- [ ] Asset uploads and management work correctly
- [ ] All features work offline with sync when connected
- [ ] Custom integrations function as designed

### **🔄 Integration Testing Protocol**
```typescript
// shared/testing/IntegrationTest.ts
export class IntegrationTestSuite {
  async runFullIntegrationTest(): Promise<TestResults> {
    const results: TestResults = {
      overall: 'pending',
      modules: {}
    }
    
    // Test each module independently
    for (const module of ['0Setting', '1Meng', '3Database', '4Extra', '5Rara']) {
      results.modules[module] = await this.testModule(module)
    }
    
    // Determine overall status
    const allPassed = Object.values(results.modules).every(r => r.status === 'passed')
    results.overall = allPassed ? 'passed' : 'failed'
    
    return results
  }

  private async testModule(moduleName: string): Promise<ModuleTestResult> {
    const tests = [
      this.testAuthentication,
      this.testApiConnectivity,
      this.testDataPersistence,
      this.testOfflineMode,
      this.testErrorHandling
    ]
    
    const results = await Promise.all(
      tests.map(test => test(moduleName))
    )
    
    return {
      status: results.every(r => r.passed) ? 'passed' : 'failed',
      tests: results
    }
  }
}
```

### **✅ Success Criteria (Must Pass ALL)**
- [ ] Each module connects successfully to its specific backend endpoints
- [ ] All forms submit successfully with proper validation and error handling
- [ ] Data syncs correctly to external services (Google Sheets for 1Meng, etc.)
- [ ] Loading states display appropriately during all async operations
- [ ] Error messages are user-friendly and actionable
- [ ] Modules work independently when launched directly (no cross-dependencies)
- [ ] No regression in existing UI/UX functionality
- [ ] Performance remains acceptable (module load time < 3 seconds)
- [ ] Offline mode works correctly with proper sync when reconnected
- [ ] Integration test suite passes 100% for all modules

### **🚨 Fallback Plan**
```typescript
// Emergency: Selective module fallback
const MODULE_FALLBACKS = {
  '0Setting': 'localStorage_only',
  '1Meng': 'local_forms',
  '3Database': 'mock_stats',
  '4Extra': 'local_notes',
  '5Rara': 'local_tracking'
}

// Steps if module integration fails:
1. Disable problematic module integrations individually
2. Keep UI fully functional with local storage
3. Show clear indicators when features are in offline mode
4. Queue all operations for later sync when backend is available
5. Test each module in isolation to identify specific issues
```

---

## 🚀 PHASE 5: DEPLOYMENT & PRODUCTION OPTIMIZATION
**🎯 Goal**: Deploy fully integrated system with production-ready performance and monitoring  
**⏱️ Duration**: 3-4 sessions (6-8 hours)  
**🔥 Priority**: LOW - Enhancement and optimization for production

### **🎯 Mandatory Requirements (Non-Negotiable)**
1. ✅ **All 6 apps must deploy successfully to production without errors**
2. ✅ **Production environment variables properly configured and secured**
3. ✅ **CORS configured correctly for all production domains**
4. ✅ **SSL/HTTPS enforced everywhere with valid certificates**
5. ✅ **No sensitive data exposed in production builds or console**
6. ✅ **Performance targets met under production load**
7. ✅ **Monitoring and health checks operational**

### **📋 Implementation Steps**

#### **Step 5.1: Production Environment Configuration**
```bash
# Production environment variables (use Replit deployment secrets)
VITE_SUPABASE_URL=https://xaluaekioqwxtzhnmygg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Same as development
VITE_SUPABASE_FUNCTIONS_BASE=https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1

# Production URLs (update for actual deployment)
VITE_LAUNCHER_URL=https://launcher.yourdomain.com
VITE_MODULE_URLS=https://setting.yourdomain.com,https://meng.yourdomain.com,https://database.yourdomain.com,https://extra.yourdomain.com,https://rara.yourdomain.com

# Production feature flags
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_OFFLINE_MODE=true
NODE_ENV=production
```

#### **Step 5.2: Build Optimization & Security**
```typescript
// vite.config.ts updates for production
export default defineConfig({
  // ... existing config
  build: {
    target: 'es2020',
    sourcemap: false, // Disable source maps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          pixi: ['pixi.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // 1MB warning limit
  }
})
```

#### **Step 5.3: CORS & Security Headers Configuration**
```sql
-- Update Supabase Edge Functions CORS settings
-- Add to each Edge Function:
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://launcher.yourdomain.com,https://setting.yourdomain.com,https://meng.yourdomain.com,https://database.yourdomain.com,https://extra.yourdomain.com,https://rara.yourdomain.com'
    : '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-origin, x-request-id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}
```

#### **Step 5.4: Production Monitoring & Health Checks**
```typescript
// shared/monitoring/HealthCheck.ts
export class ProductionHealthCheck {
  private healthInterval: number | null = null
  
  constructor() {
    this.startHealthMonitoring()
  }

  private startHealthMonitoring() {
    // Check health every 5 minutes in production
    this.healthInterval = window.setInterval(() => {
      this.performHealthCheck()
    }, 5 * 60 * 1000)
    
    // Initial health check
    this.performHealthCheck()
  }

  private async performHealthCheck() {
    const checks = [
      this.checkSupabaseConnectivity(),
      this.checkEdgeFunctions(),
      this.checkLocalStorage(),
      this.checkNetworkConnectivity()
    ]
    
    const results = await Promise.allSettled(checks)
    const failures = results.filter(r => r.status === 'rejected')
    
    if (failures.length > 0) {
      console.warn('[healthCheck] Some systems failing:', failures)
      this.reportHealthIssues(failures)
    } else {
      console.log('[healthCheck] All systems healthy')
    }
  }

  private async checkSupabaseConnectivity(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('health_check')
        .select('1')
        .limit(1)
      
      return !error
    } catch {
      return false
    }
  }

  private async checkEdgeFunctions(): Promise<boolean> {
    try {
      const response = await fetch(`${env.functionsBase}/test-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ health_check: true })
      })
      
      return response.ok
    } catch {
      return false
    }
  }

  private reportHealthIssues(failures: any[]) {
    // In production, this would report to monitoring service
    console.error('[healthCheck] Reporting health issues:', failures)
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()
  
  recordApiCall(endpoint: string, duration: number) {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, [])
    }
    
    this.metrics.get(endpoint)!.push(duration)
    
    // Keep only last 100 measurements
    const measurements = this.metrics.get(endpoint)!
    if (measurements.length > 100) {
      measurements.shift()
    }
    
    // Report if average exceeds threshold
    const average = measurements.reduce((a, b) => a + b, 0) / measurements.length
    if (average > 2000) { // 2 seconds
      console.warn(`[performance] Slow API: ${endpoint} averaging ${average}ms`)
    }
  }

  getPerformanceReport(): Record<string, { average: number; p95: number; count: number }> {
    const report: Record<string, { average: number; p95: number; count: number }> = {}
    
    for (const [endpoint, measurements] of this.metrics) {
      const sorted = [...measurements].sort((a, b) => a - b)
      const average = measurements.reduce((a, b) => a + b, 0) / measurements.length
      const p95Index = Math.floor(measurements.length * 0.95)
      const p95 = sorted[p95Index] || 0
      
      report[endpoint] = { average, p95, count: measurements.length }
    }
    
    return report
  }
}
```

#### **Step 5.5: Deployment Configuration**
```typescript
// Update replit deployment configuration
// In .replit file or deployment settings:
{
  "deployment": {
    "deploymentTarget": "autoscale",
    "run": ["npm", "run", "build:launcher", "&&", "npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5000", "apps/Launcher"],
    "build": ["npm", "install", "&&", "npm", "run", "build:launcher"]
  }
}

// For each module, create separate deployment:
// 0Setting deployment:
{
  "deployment": {
    "deploymentTarget": "autoscale", 
    "run": ["npm", "run", "build:0setting", "&&", "npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5001", "apps/0Setting"],
    "build": ["npm", "install", "&&", "npm", "run", "build:0setting"]
  }
}
```

#### **Step 5.6: Security Audit & Final Validation**
```bash
# Security checklist for production:
1. No service role keys in frontend builds
2. All API endpoints require proper authentication
3. CORS configured for specific domains only
4. HTTPS enforced on all production URLs
5. No debug information in production console
6. Source maps disabled
7. All secrets properly configured in deployment environment
8. Rate limiting configured in Supabase
9. Database RLS policies properly configured
10. File upload restrictions in place
```

### **✅ Success Criteria (Must Pass ALL)**
- [ ] All 6 apps deploy successfully to production without build errors
- [ ] Production authentication flow works end-to-end across all modules
- [ ] CORS configured correctly (no browser console CORS errors in production)
- [ ] SSL certificates valid and HTTPS enforced everywhere
- [ ] API response times average < 2 seconds (95th percentile < 5 seconds)
- [ ] Bundle sizes optimized (each app < 1MB gzipped)
- [ ] Health checks report "healthy" status for all services
- [ ] Error tracking captures and reports production issues
- [ ] Performance monitoring shows acceptable metrics
- [ ] Security audit passes with no critical vulnerabilities
- [ ] User acceptance testing passes on production deployment

### **🚨 Fallback Plan**
```typescript
// Emergency: Gradual deployment rollback
const DEPLOYMENT_FALLBACK = {
  rollback_to_staging: true,
  disable_problematic_features: ['analytics', 'real_time_sync'],
  enable_maintenance_mode: false
}

// Steps if production deployment fails:
1. Immediate rollback to last known working version
2. Deploy apps individually to isolate problematic modules
3. Use staging environment for testing complex features
4. Implement blue-green deployment strategy
5. Enable maintenance mode if critical issues found
6. Document all failures and resolution steps
```

---

## 📋 MANDATORY AI AGENT CONTRACTS

### **🚫 ABSOLUTE PROHIBITIONS (ZERO TOLERANCE)**
1. **NEVER expose service role key in frontend code, commits, console logs, or error messages**
2. **NEVER break existing functionality without explicit user approval and documented rollback plan**
3. **NEVER commit secrets, passwords, or API keys to version control**
4. **NEVER modify database schema or structure without prior backup and approval**
5. **NEVER deploy to production without successful testing in development environment**
6. **NEVER remove or disable existing features without explicit permission**
7. **NEVER make assumptions about user requirements - always confirm first**
8. **NEVER proceed to next phase if current phase success criteria not met**

### **✅ REQUIRED PRACTICES (MANDATORY)**
1. **ALWAYS test each change in isolation before proceeding to next step**
2. **ALWAYS preserve working state after each step (version control, backups)**
3. **ALWAYS implement comprehensive error handling with user-friendly messages**
4. **ALWAYS use TypeScript types for all API interactions and data structures**
5. **ALWAYS validate input data before sending to backend**
6. **ALWAYS include fallback mechanisms for offline/error scenarios**
7. **ALWAYS document what was changed, why, and how to revert**
8. **ALWAYS verify success criteria before marking phase complete**

### **🔄 CHANGE MANAGEMENT PROTOCOL**
1. **Before any change**: 
   - Test current state works as expected
   - Document current behavior and state
   - Identify exact files and functions to be modified
   - Plan rollback strategy

2. **During change**: 
   - Make minimal, incremental modifications
   - Test each small change before proceeding
   - Keep terminal output and error logs for review
   - Stop immediately if unexpected behavior occurs

3. **After change**: 
   - Verify functionality works exactly as before + new features
   - Run integration tests if available
   - Check for any regression in existing features
   - Document the change and any issues encountered

4. **If change fails**: 
   - Immediately revert to previous working state
   - Document exactly what failed and why
   - Do not attempt alternative approaches without approval
   - Report failure with specific error messages and steps taken

5. **Documentation requirements**:
   - Record what worked and what failed
   - Include specific error messages and stack traces
   - Note exact steps taken and files modified
   - Provide clear instructions for reproducing issues

### **🧪 TESTING REQUIREMENTS**

#### **Unit Level Testing**
- Each function/component works independently
- All error conditions handled gracefully
- Type checking passes without warnings
- No console errors in normal operation

#### **Integration Level Testing**
- Components work together correctly
- API calls succeed with valid responses
- Authentication flows work end-to-end
- Data persistence works across browser sessions

#### **System Level Testing**
- End-to-end user workflows complete successfully
- Cross-module communication works (launcher ↔ modules)
- Performance within acceptable limits
- Works in both online and offline modes

#### **Error Scenario Testing**
- Network failures handled gracefully
- Invalid API responses don't crash app
- Authentication failures redirect appropriately
- Database connection issues show user-friendly messages

#### **Performance Testing**
- Page load times under 3 seconds
- API response times under 2 seconds
- Memory usage within reasonable limits
- No memory leaks during normal operation

---

## 🚨 COMPREHENSIVE EMERGENCY FALLBACK PROCEDURES

### **🔴 COMPLETE AUTHENTICATION FAILURE**
```typescript
// Emergency: Disable auth entirely
const EMERGENCY_NO_AUTH = process.env.VITE_EMERGENCY_NO_AUTH === 'true'

if (EMERGENCY_NO_AUTH) {
  console.warn('[EMERGENCY] Authentication disabled - using anonymous mode')
  
  // Override auth hooks to return anonymous state
  export const useAuth = () => ({
    user: null,
    session: null,
    loading: false,
    signIn: async () => ({ error: 'Authentication disabled' }),
    signOut: async () => {},
    refreshSession: async () => {}
  })
  
  export const useModuleAuth = () => ({
    user: null,
    session: null,
    isAuthenticated: false,
    loading: false
  })
  
  // Use test-submit endpoint for all operations
  // Store all data in localStorage
  // Show clear warning to user about anonymous mode
}
```

### **🔴 BACKEND APIs COMPLETELY DOWN**
```typescript
// Fallback: Complete offline mode
const API_COMPLETE_FAILURE = true

if (API_COMPLETE_FAILURE) {
  console.warn('[EMERGENCY] Backend APIs unavailable - entering offline mode')
  
  // Override all API clients
  export class OfflineApiClient {
    async call<T>(endpoint: string, options: any): Promise<ApiResponse<T>> {
      // Store requests in queue for later processing
      this.queueRequest(endpoint, options)
      
      // Return mock success response
      return {
        success: true,
        data: this.getMockData(endpoint) as T,
        metadata: {
          timestamp: new Date().toISOString(),
          request_id: crypto.randomUUID(),
          processing_time_ms: 100
        }
      }
    }
    
    private queueRequest(endpoint: string, options: any) {
      const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]')
      queue.push({ endpoint, options, timestamp: Date.now() })
      localStorage.setItem('offline_queue', JSON.stringify(queue))
    }
    
    private getMockData(endpoint: string): any {
      // Return appropriate mock data based on endpoint
      if (endpoint.includes('analytics')) {
        return { configs: 0, submissions: 0, assets: 0 }
      }
      if (endpoint.includes('submit')) {
        return { id: crypto.randomUUID(), status: 'queued' }
      }
      return {}
    }
  }
  
  // Show prominent offline indicator
  // Store all operations locally
  // Attempt to sync when connection restored
}
```

### **🔴 ENVIRONMENT VARIABLES FAILURE**
```typescript
// Emergency: Hardcoded fallback configuration
const EMERGENCY_CONFIG = {
  supabaseUrl: 'https://xaluaekioqwxtzhnmygg.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I',
  functionsBase: 'https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1'
}

export function readSbEnvOrThrow(): SupabaseEnvConfig {
  try {
    // Try normal environment loading first
    const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    const functionsBase = import.meta.env.VITE_SUPABASE_FUNCTIONS_BASE || process.env.SUPABASE_FUNCTIONS_BASE
    
    if (url && anonKey && functionsBase) {
      return { url, anonKey, functionsBase, debug: false }
    }
  } catch (error) {
    console.warn('[sbEnv] Environment loading failed, using emergency config:', error)
  }
  
  console.warn('[EMERGENCY] Using hardcoded configuration - this should only happen in development')
  
  return {
    url: EMERGENCY_CONFIG.supabaseUrl,
    anonKey: EMERGENCY_CONFIG.anonKey,
    functionsBase: EMERGENCY_CONFIG.functionsBase,
    debug: true
  }
}
```

### **🔴 COMPLETE INTEGRATION FAILURE**
```typescript
// Emergency: Revert to pre-integration state
const COMPLETE_INTEGRATION_FAILURE = process.env.VITE_DISABLE_INTEGRATION === 'true'

if (COMPLETE_INTEGRATION_FAILURE) {
  console.error('[EMERGENCY] Complete integration failure - reverting to standalone mode')
  
  // Disable all backend integration
  // Use localStorage for all data persistence
  // Show clear error message to user
  // Provide manual sync option when backend restored
  
  // Override all hooks to use local storage only
  export const useSettings = () => {
    const [settings, setSettings] = useState(() => 
      JSON.parse(localStorage.getItem('settings') || 'null') || DEFAULT_SETTINGS
    )
    
    const updateSettings = (updates: any) => {
      const newSettings = { ...settings, ...updates }
      setSettings(newSettings)
      localStorage.setItem('settings', JSON.stringify(newSettings))
    }
    
    return { settings, updateSettings, error: 'Backend integration disabled' }
  }
}
```

### **🔄 RECOVERY PROCEDURES**

#### **Immediate Actions (0-5 minutes)**
1. **Stop all deployment processes**
2. **Revert to last known working state**
3. **Enable maintenance mode if critical**
4. **Document exact failure and error messages**
5. **Notify stakeholders of issue**

#### **Short-term Actions (5-30 minutes)**
1. **Identify root cause of failure**
2. **Implement appropriate emergency fallback**
3. **Test fallback functionality**
4. **Monitor system stability**
5. **Prepare recovery plan**

#### **Recovery Actions (30+ minutes)**
1. **Fix underlying issue**
2. **Test fix in development environment**
3. **Gradually restore functionality**
4. **Monitor for any regression**
5. **Document lessons learned**

#### **Communication Protocol**
1. **Immediate**: Log all errors and steps taken
2. **Short-term**: Update team on status and ETA
3. **Recovery**: Confirm resolution and post-mortem
4. **Documentation**: Update procedures based on learning

---

## 📊 INTEGRATION SUCCESS METRICS & MONITORING

### **📈 Performance Targets**

#### **Phase 1 Metrics**
- Environment setup time: < 30 minutes
- Zero hardcoded secrets remaining: 100%
- All apps boot successfully: 100%
- TypeScript compilation: 0 errors
- Connection test success rate: 100%

#### **Phase 2 Metrics**
- Authentication success rate: > 95%
- Cross-app session propagation: < 2 seconds
- Token security validation: 100% pass
- Origin validation blocks: 100% of unauthorized requests
- Session refresh success: > 99%

#### **Phase 3 Metrics**
- API response success rate: > 99%
- Average API response time: < 1 second
- 95th percentile response time: < 2 seconds
- Error handling coverage: 100%
- Retry success rate: > 80%
- Offline queue processing: 100%

#### **Phase 4 Metrics**
- Module feature completion: 100%
- Data sync accuracy: 100%
- User workflow completion: > 90%
- Integration test pass rate: 100%
- Performance regression: < 5%

#### **Phase 5 Metrics**
- Production deployment success: 100%
- Performance targets met: > 95%
- Security vulnerabilities: 0 critical, 0 high
- Health check uptime: > 99.9%
- User satisfaction: > 90%

### **🚨 Alert Thresholds**

#### **Critical Alerts (Immediate Action Required)**
- API response time > 5 seconds
- Error rate > 5%
- Authentication failure rate > 10%
- Health check failures > 3 consecutive
- Security vulnerability detected

#### **Warning Alerts (Monitor Closely)**
- API response time > 2 seconds
- Error rate > 1%
- Authentication failure rate > 2%
- Memory usage > 80%
- Bundle size increase > 20%

#### **Info Alerts (Track Trends)**
- API response time > 1 second
- New user signups
- Feature usage statistics
- Performance improvements
- Successful deployments

---

## 🎯 FINAL INTEGRATION CHECKLIST

### **✅ Pre-Implementation Verification**
- [ ] All secrets properly documented and accessible
- [ ] Replit environment configured correctly
- [ ] Development environment working
- [ ] All 6 apps boot without errors
- [ ] Team understands implementation plan
- [ ] Rollback procedures tested and verified

### **✅ Phase-by-Phase Completion**
- [ ] **Phase 1**: Foundation setup complete and tested
- [ ] **Phase 2**: Authentication working across all modules
- [ ] **Phase 3**: API integration functional with error handling
- [ ] **Phase 4**: Module-specific features implemented
- [ ] **Phase 5**: Production deployment successful

### **✅ Pre-Launch Verification**
- [ ] All success criteria met for all phases
- [ ] Integration tests passing 100%
- [ ] Performance targets achieved
- [ ] Security review completed
- [ ] Error handling tested under various scenarios
- [ ] Offline functionality verified
- [ ] Documentation complete and accurate
- [ ] Monitoring and health checks operational

### **✅ Post-Launch Monitoring**
- [ ] Health checks passing consistently
- [ ] Error rates within acceptable limits
- [ ] Performance metrics meeting targets
- [ ] User feedback positive
- [ ] No security incidents reported
- [ ] Data integrity maintained
- [ ] All features functioning as designed

---

## 📞 SUPPORT & TROUBLESHOOTING GUIDE

### **🔍 Common Issues & Solutions**

#### **Environment Variables Not Loading**
```bash
# Check Replit secrets
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Verify environment loading
npm run dev:launcher -- --debug

# Force reload environment
rm -rf node_modules/.vite
npm run dev:launcher
```

#### **CORS Errors in Production**
```javascript
// Check allowed origins in Supabase dashboard
// Verify production URLs match exactly
// Update Edge Function CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}
```

#### **Authentication Not Working Across Modules**
```javascript
// Verify postMessage origin allowlist
console.log('Current origin:', window.location.origin)
console.log('Allowed origins:', ALLOWED_ORIGINS)

// Check message structure
window.addEventListener('message', (event) => {
  console.log('Received message:', event.data, 'from:', event.origin)
})
```

#### **API Calls Returning 401 Errors**
```javascript
// Check token validity
const token = await supabase.auth.getSession()
console.log('Current token:', token?.access_token?.substring(0, 20) + '...')

// Verify user permissions
const { data: user } = await supabase.auth.getUser()
console.log('Current user:', user)

// Test with service role (backend only)
// Never use service role in frontend!
```

#### **Data Not Syncing to Google Sheets**
```javascript
// Check Google Service Account permissions
// Verify spreadsheet ID and folder ID
// Test Google API connectivity
// Check Edge Function logs for Google API errors
```

### **🧰 Debug Commands**

#### **Development Debugging**
```bash
# Check all environment variables
npm run dev:launcher -- --debug

# Test API connectivity
curl -H "Authorization: Bearer TOKEN" \
  https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/test-submit

# Verify Supabase connection
npx supabase status

# Check secrets configuration
npx replit secrets list

# Test each module independently
npm run dev:0setting
npm run dev:1meng
npm run dev:3database
npm run dev:4extra
npm run dev:5rara
```

#### **Production Debugging**
```bash
# Check production build
npm run build:all

# Test production preview
npm run preview:launcher

# Verify production environment
NODE_ENV=production npm run dev:launcher

# Check bundle sizes
npm run build:launcher && ls -la apps/Launcher/dist/assets/
```

#### **Database Debugging**
```sql
-- Check user configurations
SELECT * FROM user_configs WHERE user_id = 'USER_ID';

-- Check form submissions
SELECT * FROM module_submissions WHERE user_id = 'USER_ID';

-- Check asset metadata
SELECT * FROM user_assets WHERE user_id = 'USER_ID';

-- Check health
SELECT NOW() as current_time;
```

### **📋 Escalation Procedures**

#### **Level 1: Development Issues**
- Check this documentation first
- Use debug commands and logs
- Test in isolation
- Check browser console for errors

#### **Level 2: Integration Issues**
- Run integration test suite
- Check cross-module communication
- Verify authentication flow
- Test API connectivity

#### **Level 3: Production Issues**
- Check health monitoring
- Review error tracking
- Verify deployment configuration
- Implement emergency fallbacks

#### **Level 4: Critical System Failure**
- Activate emergency procedures
- Enable maintenance mode
- Notify all stakeholders
- Implement complete rollback

---

## 📝 CHANGELOG & VERSION HISTORY

### **Version 1.0 - Initial Backend Integration**
- **Date**: September 15, 2025
- **Status**: Ready for Implementation
- **Components**: Complete integration plan for all 6 applications
- **Features**: Authentication, API integration, module-specific functionality
- **Testing**: Comprehensive test coverage and fallback procedures

### **Future Versions**
- **v1.1**: Enhanced analytics and reporting
- **v1.2**: Real-time collaboration features  
- **v1.3**: Advanced security and compliance
- **v2.0**: Multi-tenant architecture support

---

**Last Updated**: September 15, 2025  
**Version**: 1.0  
**Status**: Ready for Implementation  
**AI Agent Compliance**: ✅ All contracts and procedures defined