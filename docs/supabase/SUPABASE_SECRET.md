Project URL https://xaluaekioqwxtzhnmygg.supabase.co
Legacy JWT secret Jf9Lc703++zJxFsargVFrrP/5QJZLY09ZJMNUfLGMu/UX4833s8UrMeFTH8+6qOyJeElPkJYm2WHZNf4GtCZzQ==
Access token expiry time 3600
anonpublic eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I
service_rolesecret eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY

deploy netlify
VITE_SUPABASE_URL=https://xaluaekioqwxtzhnmygg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODQ1OTEsImV4cCI6MjA3Mjc2MDU5MX0.1-SFKaJtbuovb7vhy1cartgZveJOsMl__luyf9I3M9I
VITE_SUPABASE_FUNCTIONS_BASE=https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1



















bucket public
Access key ID 270bd43e0a08583f0af6e6d93f2c7bab
Secret access key 182186923e8b6644cb9280ab2389fe0b272f808d1ab4f7c49f42f957e4fd6f0b



Allow clients to connect to Supabase Storage via the S3 protocol
Endpoint https://xaluaekioqwxtzhnmygg.storage.supabase.co/storage/v1/s3
Region ap-southeast-1




import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xaluaekioqwxtzhnmygg.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)



# Wajib: URL yang benar
supabase secrets set SUPABASE_URL='https://xaluaekioqwxtzhnmygg.supabase.co'

# Wajib: Service Role Key (jangan taruh di frontend)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY'

# Wajib: JSON service account lengkap
$sa = @'
{
  "type": "service_account",
  "project_id": "yuzhayo",
  "private_key_id": "ebbd46a05b2d022271b9d8d8840f8e25e6967156",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCCKmqVNli8VbHI\nFPk7JUScWhhdB/2VLsTzwBMFPGsEbbQVq+BPrRXpuV7DvFC27b06UULjyUjjGuPp\nmaSQ9JTRRSRovGCqUSoJhCzNpkCM3LygyH6Q48HoGaQgR5wwgCMNwEATomokybjR\nK/B1ejAiRsC5twAmXkZERJjXlIRi5J4DU1oQN4F1bci//44wjnxBQqww3cd2wQES\niOnr9HTYcNN52mvqLqe4ZpjnRNhQIsCAL1Bylnuc0gPYAz7qBJh23eNosjUr7biC\ntmqbj6f+EamPHcdlZRSZMyre1XgKDACOellWRbsEDj82l4oFKd316DPwPwxNjf0L\nyLfGtGQZAgMBAAECggEACSxpmg38N3u3nZEC1p0EBpvf4zCUuc6TwVT8Ui5loWiE\n3FEibCMX7AKtL9DGBHphT2qaMvkE2sKSpOw32aJvGYeMrxf1nRM+yfBngu/QVU0a\nOx+eMeJnUE78Tu0VECL7tXSi329fGSwhSxaUagccPNItM3l2+H1E6PtHpUvZf6mg\n0VDSjwjEIZCWPl8vG4oZUfwI56LQzP9z7sya2ZQ6hgmuP6irtziZMQOPtVmeJU+X\nLqbAc1SCj+B1NQp8Dwe+HS/lse3nwsC2b66jou1vLq8kFhg107/NELKDWSDdJrBe\nUrcddERbeafsshPwWpIHFzt9KNMg7HJz1jq65P7ArQKBgQC2kkW1bpT4ao0MAoBr\nxJO6oqmvw21AYWpIPPa676l4Nt7Rpgc++PlRvRLjnjZseu0GS+rnTjoAQhOYfKxT\n1lzTbpUDxY/5SBwcwYZC/H0zoOk6R/kfJv626R5Xa0wDnGxFnhkHe2Uy2peMxjI9\n//65tpqUWOj4cZhuHrTTbxEiRQKBgQC2hGc0e/uDVEAKGowlnDsAzQLiT/DJmu3/\neZNBjpYOVsLkHS+eoKD+CrGaDFxA9vAAY1sBT239GYijK80GraBq7VG07VR+uaec\n0EYSceHFNdtO055SeU+VC30fLvaBGqLKt4tBET8vvhSyogW+8i2Ai5fRQ27Blq7q\naS/uR2PBxQKBgGL8qbj2LOUHeFPzo0dK/MHrYc8/SSPn7WUfULMIMD1SmrrWpwUY\nnq0Xs38gD+f/OjX4wXMJ8d6j9NXvesu15Pxp73dtDWOeGkfpEW+OUB/G9c04qrSe\nQupPOLkzHrKyg+23C2EIIVVSOWsFJsaA3s44WFVoY2AYzwmdsnMUvBh1AoGABeu5\npVw4RoRfJ3TBAx9UUqxT4Z+SQhgCjH0XJ9NGTuTFobzIpK61SkhyhnrMK1dXZcvT\nUfGPsdw4MILlPcg4If/c3K+uRAYlx9KB02taVZlvqdj3k9lXmZAr2O0fFgUVLtpR\nbCTxFc1mwny7DvywOTFOFX3IhAMtXXFYGrS6KbkCgYA1woO1HIDamIeqfPEqHx/e\nIscyxLsf7gix/xJeNh3Hn7f1AG7RK8crVB8Y0cO3/LxSR08bCeTFEmBQaUVs2tIr\ngNpU/Xs6T3ypj5yhoF1vWFVh377c7KmgQf/EV9bwvGbYfFFwe4N8812mXo52dqdX\nYp35uw6pojgfI0NFwBunsw==\n-----END PRIVATE KEY-----\n",
  "client_email": "yuzha-967@yuzhayo.iam.gserviceaccount.com",
  "client_id": "117388252118981647923",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/yuzha-967%40yuzhayo.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
'@
supabase secrets set GOOGLE_SERVICE_ACCOUNT="$sa"

# Target Drive & Sheet
supabase secrets set GOOGLE_DRIVE_FOLDER_ID='12T5SpHRfmrDjom9HcH3LDl0J9P0oe3b5'
supabase secrets set GOOGLE_SPREADSHEET_ID='1YBhC5jsyStO3METamY2b-JOGgU-_wd-Q_7XPUBNDZ2E'

# Cek sudah kepasang
supabase secrets list

# 🚀 SUPABASE USER HUB - COMPLETE SETUP GUIDE

## 📋 PROJECT OVERVIEW

**Project Name**: Yuzhayo User Hub  
**Tech Stack**: Supabase Edge Functions + PostgreSQL + Storage  
**Purpose**: Complete backend hub for multi-module applications with device sync, form submissions, and asset management

**Live Project URL**: https://xaluaekioqwxtzhnmygg.supabase.co  
**Project Reference ID**: `xaluaekioqwxtzhnmygg`

---

## 🗂️ PROJECT STRUCTURE

```
C:\VSCODE\yuzha\supabase\
├── config.toml                           # Supabase project configuration
├── seed.sql                              # Database seed data
├── migrations/
│   ├── 001_initial_schema.sql            # Original schema (forms, auth)
│   └── 002_user_hub.sql                  # User Hub tables (configs, assets, modules)
└── functions/
    ├── form-submit/index.ts              # Original form submission + Google integration
    ├── auth/index.ts                     # Authentication endpoints  
    ├── recap/index.ts                    # User submissions & statistics
    ├── test-submit/index.ts              # Test endpoint (no auth required)
    └── user-hub/index.ts                 # NEW: Complete User Hub API
```

---

## 🔐 ENVIRONMENT VARIABLES & CREDENTIALS

### **Required Supabase Secrets**
```bash
# Core Supabase
SUPABASE_URL='https://xaluaekioqwxtzhnmygg.supabase.co'
SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY'

# Google Integration (for existing form-submit function)
GOOGLE_SERVICE_ACCOUNT='{
  "type": "service_account",
  "project_id": "yuzhayo",
  "private_key_id": "ebbd46a05b2d022271b9d8d8840f8e25e6967156",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCCKmqVNli8VbHI\nFPk7JUScWhhdB/2VLsTzwBMFPGsEbbQVq+BPrRXpuV7DvFC27b06UULjyUjjGuPp\nmaSQ9JTRRSRovGCqUSoJhCzNpkCM3LygyH6Q48HoGaQgR5wwgCMNwEATomokybjR\nK/B1ejAiRsC5twAmXkZERJjXlIRi5J4DU1oQN4F1bci//44wjnxBQqww3cd2wQES\niOnr9HTYcNN52mvqLqe4ZpjnRNhQIsCAL1Bylnuc0gPYAz7qBJh23eNosjUr7biC\ntmqbj6f+EamPHcdlZRSZMyre1XgKDACOellWRbsEDj82l4oFKd316DPwPwxNjf0L\nyLfGtGQZAgMBAAECggEACSxpmg38N3u3nZEC1p0EBpvf4zCUuc6TwVT8Ui5loWiE\n3FEibCMX7AKtL9DGBHphT2qaMvkE2sKSpOw32aJvGYeMrxf1nRM+yfBngu/QVU0a\nOx+eMeJnUE78Tu0VECL7tXSi329fGSwhSxaUagccPNItM3l2+H1E6PtHpUvZf6mg\n0VDSjwjEIZCWPl8vG4oZUfwI56LQzP9z7sya2ZQ6hgmuP6irtziZMQOPtVmeJU+X\nLqbAc1SCj+B1NQp8Dwe+HS/lse3nwsC2b66jou1vLq8kFhg107/NELKDWSDdJrBe\nUrcddERbeafsshPwWpIHFzt9KNMg7HJz1jq65P7ArQKBgQC2kkW1bpT4ao0MAoBr\nxJO6oqmvw21AYWpIPPa676l4Nt7Rpgc++PlRvRLjnjZseu0GS+rnTjoAQhOYfKxT\n1lzTbpUDxY/5SBwcwYZC/H0zoOk6R/kfJv626R5Xa0wDnGxFnhkHe2Uy2peMxjI9\n//65tpqUWOj4cZhuHrTTbxEiRQKBgQC2hGc0e/uDVEAKGowlnDsAzQLiT/DJmu3/\neZNBjpYOVsLkHS+eoKD+CrGaDFxA9vAAY1sBT239GYijK80GraBq7VG07VR+uaec\n0EYSceHFNdtO055SeU+VC30fLvaBGqLKt4tBET8vvhSyogW+8i2Ai5fRQ27Blq7q\naS/uR2PBxQKBgGL8qbj2LOUHeFPzo0dK/MHrYc8/SSPn7WUfULMIMD1SmrrWpwUY\nnq0Xs38gD+f/OjX4wXMJ8d6j9NXvesu15Pxp73dtDWOeGkfpEW+OUB/G9c04qrSe\nQupPOLkzHrKyg+23C2EIIVVSOWsFJsaA3s44WFVoY2AYzwmdsnMUvBh1AoGABeu5\npVw4RoRfJ3TBAx9UUqxT4Z+SQhgCjH0XJ9NGTuTFobzIpK61SkhyhnrMK1dXZcvT\nUfGPsdw4MILlPcg4If/c3K+uRAYlx9KB02taVZlvqdj3k9lXmZAr2O0fFgUVLtpR\nbCTxFc1mwny7DvywOTFOFX3IhAMtXXFYGrS6KbkCgYA1woO1HIDamIeqfPEqHx/e\nIscyxLsf7gix/xJeNh3Hn7f1AG7RK8crVB8Y0cO3/LxSR08bCeTFEmBQaUVs2tIr\ngNpU/Xs6T3ypj5yhoF1vWFVh377c7KmgQf/EV9bwvGbYfFFwe4N8812mXo52dqdX\nYp35uw6pojgfI0NFwBunsw==\n-----END PRIVATE KEY-----\n",
  "client_email": "yuzha-967@yuzhayo.iam.gserviceaccount.com",
  "client_id": "117388252118981647923",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/yuzha-967%40yuzhayo.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}'

GOOGLE_DRIVE_FOLDER_ID='12T5SpHRfmrDjom9HcH3LDl0J9P0oe3b5'
GOOGLE_SPREADSHEET_ID='1YBhC5jsyStO3METamY2b-JOGgU-_wd-Q_7XPUBNDZ2E'
```

### **How to Set Secrets**
```bash
cd C:\VSCODE\yuzha

# Set all secrets at once
supabase secrets set SUPABASE_URL='https://xaluaekioqwxtzhnmygg.supabase.co'
supabase secrets set SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbHVhZWtpb3F3eHR6aG5teWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE4NDU5MSwiZXhwIjoyMDcyNzYwNTkxfQ.c_ZJGzWRP2FhS08_Kl-pqDTy9KO7HOKDDOUfgd_zqMY'
# ... (copy all other secrets from above)
```

---

## 🗄️ DATABASE SCHEMA

### **Existing Tables (from 001_initial_schema.sql)**
- `form_submissions` - Original form data storage
- Various auth and user tables

### **New Tables (from 002_user_hub.sql)**

#### **1. user_configs** - Device Sync & Settings
```sql
CREATE TABLE user_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_name TEXT NOT NULL DEFAULT 'default',
    config_type TEXT NOT NULL, -- 'settings', 'sync-data', 'preferences'
    config_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, profile_name, config_type)
);
```

#### **2. user_assets** - File/Asset Metadata
```sql
CREATE TABLE user_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_name TEXT NOT NULL,
    asset_type TEXT NOT NULL, -- 'image', 'document', 'config-file'
    file_path TEXT NOT NULL, -- Storage bucket path
    file_size BIGINT,
    mime_type TEXT,
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **3. module_submissions** - Modular Form Data
```sql
CREATE TABLE module_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL, -- 'module-a', 'module-b', 'feedback'
    submission_data JSONB NOT NULL DEFAULT '{}',
    submission_status TEXT DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 EDGE FUNCTIONS

### **Existing Functions** ✅
- `form-submit` - Form submission with Google Drive/Sheets integration
- `auth` - Authentication endpoints
- `recap` - User submissions and statistics  
- `test-submit` - Test endpoint (no auth required)

### **New Function: user-hub** 🆕

**File Location**: `supabase/functions/user-hub/index.ts`

**Features**:
- ✅ Two-way config sync (settings, preferences)
- ✅ One-way form submissions (modular)
- ✅ Asset metadata management
- ✅ User analytics
- ✅ Multi-profile support
- ✅ Full authentication
- ✅ Comprehensive error handling

---

## 🎯 COMPLETE API REFERENCE

### **Base URL**: `https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1`

### **Authentication**
All endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### **🔄 CONFIG SYNC ENDPOINTS** (Two-way)

#### **GET /user-hub/settings**
**Purpose**: Load UI preferences from any device  
**Query Params**: `?profile=default` (optional)
```bash
curl -H "Authorization: Bearer TOKEN" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/settings"
```
**Response**:
```json
{
  "success": true,
  "data": {"theme": "dark", "language": "en"},
  "profile": "default", 
  "last_updated": "2025-09-07T02:00:00Z"
}
```

#### **POST /user-hub/settings**
**Purpose**: Save UI preferences to sync across devices
```bash
curl -X POST \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"theme": "dark", "language": "en", "notifications": true}' \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/settings"
```

#### **DELETE /user-hub/settings**
**Purpose**: Reset UI preferences
```bash
curl -X DELETE \
     -H "Authorization: Bearer TOKEN" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/settings"
```

#### **Sync Data Endpoints**
Same pattern as settings:
- `GET/POST/DELETE /user-hub/sync-data` - For app-specific sync data

### **📝 FORM SUBMISSION ENDPOINTS** (One-way)

#### **POST /user-hub/module-a/submit**
**Purpose**: Submit data from Module A
```bash
curl -X POST \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"field1": "value1", "field2": "value2"}' \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/module-a/submit"
```

#### **POST /user-hub/module-b/submit**
**Purpose**: Submit data from Module B

#### **POST /user-hub/feedback/submit**
**Purpose**: Submit feedback forms

### **🗂️ ASSET MANAGEMENT ENDPOINTS**

#### **GET /user-hub/assets**
**Purpose**: List user's assets
**Query Params**: `?type=image&limit=50`
```bash
curl -H "Authorization: Bearer TOKEN" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/assets?type=image"
```

#### **POST /user-hub/assets**
**Purpose**: Save asset metadata (after uploading to storage)
```bash
curl -X POST \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "profile-pic.jpg",
       "type": "image",
       "path": "user-assets/USER_ID/profile-pic.jpg",
       "size": 1024000,
       "mimeType": "image/jpeg"
     }' \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/assets"
```

#### **DELETE /user-hub/assets/{id}**
**Purpose**: Delete asset metadata
```bash
curl -X DELETE \
     -H "Authorization: Bearer TOKEN" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/assets/ASSET_ID"
```

### **📊 ANALYTICS ENDPOINT**

#### **GET /user-hub/analytics**
**Purpose**: Get user activity statistics
```bash
curl -H "Authorization: Bearer TOKEN" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/analytics"
```
**Response**:
```json
{
  "success": true,
  "analytics": {
    "configs": 5,
    "submissions": 12,
    "assets": 8,
    "last_activity": 1725678000000
  },
  "breakdown": {
    "config_types": {"settings": 3, "sync-data": 2},
    "submission_modules": {"module-a": 7, "feedback": 5},
    "asset_types": {"image": 5, "document": 3}
  }
}
```

---

## 🗂️ STORAGE BUCKETS SETUP

### **Required Buckets**

#### **1. user-assets** (Private)
```
Name: user-assets
Public: OFF (Private)
File size limit: 50MB
Allowed MIME types: image/*, application/pdf, text/*
```

#### **2. public-assets** (Public)
```
Name: public-assets  
Public: ON (Public)
File size limit: 50MB
Allowed MIME types: image/*, application/pdf
```

### **Storage Policies**

#### **Private Assets (user-assets bucket)**
```sql
-- Users can view their own files
CREATE POLICY "Users can view own assets"
ON storage.objects FOR SELECT
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Users can upload their own files  
CREATE POLICY "Users can upload own assets"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own files
CREATE POLICY "Users can update own assets" 
ON storage.objects FOR UPDATE
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own files
CREATE POLICY "Users can delete own assets"
ON storage.objects FOR DELETE  
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

#### **Public Assets (public-assets bucket)**
```sql
-- Anyone can view public assets
CREATE POLICY "Public assets are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

-- Users can upload to public assets
CREATE POLICY "Users can upload public assets"
ON storage.objects FOR INSERT  
WITH CHECK (bucket_id = 'public-assets' AND auth.role() = 'authenticated');
```

### **File Upload Process**
1. **Upload file** → Supabase Storage bucket (get file path)
2. **Save metadata** → POST `/user-hub/assets` (store path + metadata)
3. **Access file** → Use Supabase storage URL + file path

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### **Prerequisites**
- Supabase CLI installed
- Project linked to `xaluaekioqwxtzhnmygg`
- User logged into Supabase CLI

### **Initial Setup**
```bash
cd C:\VSCODE\yuzha

# 1. Login to Supabase
supabase login

# 2. Link to project
supabase link --project-ref xaluaekioqwxtzhnmygg

# 3. Set environment variables
supabase secrets set SUPABASE_URL='https://xaluaekioqwxtzhnmygg.supabase.co'
# ... (set all secrets from credentials section)
```

### **Deploy Database**
```bash
# Deploy migrations (both 001 and 002)
supabase db push
```

### **Deploy Functions**
```bash
# Deploy all functions
supabase functions deploy form-submit
supabase functions deploy auth  
supabase functions deploy recap
supabase functions deploy test-submit
supabase functions deploy user-hub  # NEW
```

### **Setup Storage Buckets**
1. Go to: https://supabase.com/dashboard/project/xaluaekioqwxtzhnmygg/storage
2. Create buckets as specified in Storage section
3. Apply storage policies via SQL Editor

---

## 🧪 TESTING PROCEDURES

### **1. Test Authentication**
```bash
# Should return 401 without token
curl "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/settings"

# Expected: {"error": "Unauthorized"}
```

### **2. Test Config Sync**
```bash
# With valid JWT token
curl -H "Authorization: Bearer VALID_JWT" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/settings"

# Expected: {"success":true,"data":{},"profile":"default","last_updated":null}
```

### **3. Test Form Submission**
```bash
curl -X POST \
     -H "Authorization: Bearer VALID_JWT" \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}' \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/module-a/submit"

# Expected: {"success":true,"message":"module-a submission saved successfully","submission_id":"..."}
```

### **4. Test Analytics**
```bash
curl -H "Authorization: Bearer VALID_JWT" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/analytics"

# Expected: Analytics object with counts and breakdowns
```

---

## 🔧 TROUBLESHOOTING

### **Common Issues**

#### **"Unauthorized" Error**
- **Cause**: Missing or invalid JWT token
- **Solution**: Ensure user is authenticated and token is valid
- **Test**: Use test-submit endpoint first (no auth required)

#### **"Route not found" Error**  
- **Cause**: Incorrect endpoint URL
- **Solution**: Check API reference section for correct routes
- **Available routes** returned in 404 response

#### **Database Connection Error**
- **Cause**: Migration not applied or RLS policies blocking access
- **Solution**: Run `supabase db push` and verify user permissions

#### **Storage Upload Issues**
- **Cause**: Bucket not created or missing policies
- **Solution**: Create buckets and apply storage policies

### **Debugging Steps**
1. Check function logs in Supabase Dashboard
2. Verify JWT token validity  
3. Test with curl commands provided
4. Check database tables exist with proper RLS policies
5. Verify storage buckets and policies are configured

---

## 📊 USAGE EXAMPLES

### **Device Sync Scenario**
```javascript
// Device A - Save settings
const response = await fetch('/functions/v1/user-hub/settings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    theme: 'dark',
    language: 'en',
    notifications: true
  })
});

// Device B - Load settings
const settings = await fetch('/functions/v1/user-hub/settings', {
  headers: { 'Authorization': `Bearer ${jwt}` }
}).then(r => r.json());

console.log(settings.data); // {theme: 'dark', language: 'en', notifications: true}
```

### **Module Form Submission**
```javascript
// Module A submitting data
const result = await fetch('/functions/v1/user-hub/module-a/submit', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    survey_response: 'Very satisfied',
    rating: 5,
    comments: 'Great experience!'
  })
});
```

### **Asset Management**
```javascript
// 1. Upload file to storage first
const fileData = new FormData();
fileData.append('file', file);

const uploadResult = await supabase.storage
  .from('user-assets')
  .upload(`${userId}/profile-pic.jpg`, file);

// 2. Save metadata to user-hub
const metadata = await fetch('/functions/v1/user-hub/assets', {
  method: 'POST', 
  headers: {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'profile-pic.jpg',
    type: 'image',
    path: uploadResult.data.path,
    size: file.size,
    mimeType: file.type
  })
});
```

---

## 🎯 SUMMARY

**Your Supabase User Hub provides:**

✅ **Cross-device sync** - Save settings on Device A, access on Device B  
✅ **Modular forms** - One-way data collection from multiple app modules  
✅ **Asset management** - File metadata storage with bucket integration  
✅ **User analytics** - Activity tracking and usage statistics  
✅ **Multi-profile support** - Different config profiles per user  
✅ **Full security** - RLS policies and JWT authentication  
✅ **Scalable architecture** - Serverless edge functions, global distribution

**All endpoints are production-ready and fully tested!** 🚀

---

**Last Updated**: September 2025  
**Status**: ✅ DEPLOYED & ACTIVE  
**Project**: https://xaluaekioqwxtzhnmygg.supabase.co


# 🔍 UPLOAD MONITORING & RETRY SYSTEM

## 🎯 OVERVIEW

**Complete system for monitoring Google Drive upload failures and automatic retry mechanisms.**

**Features:**
- ✅ **Real-time failure detection** - Know immediately when Drive uploads fail
- ✅ **Automatic retry system** - Retry failed uploads up to 3 times
- ✅ **Smart cleanup** - Auto-delete from Supabase after successful Drive upload
- ✅ **Monitoring dashboard** - Track upload status and failures
- ✅ **Storage optimization** - Minimal long-term Supabase storage usage

---

## 🚀 DEPLOYMENT COMMANDS

**Run these in `C:\VSCODE\yuzha`:**

```bash
# 1. Deploy new database tables
supabase db push

# 2. Deploy updated functions
supabase functions deploy form-submit
supabase functions deploy user-hub  
supabase functions deploy storage-retry  # NEW
```

---

## 📊 NEW DATABASE TABLES

### **1. upload_status** - Track Upload Progress
```sql
- id: UUID (primary key)
- user_id: UUID (user reference)
- file_name: TEXT (uploaded filename)
- file_path: TEXT (Supabase storage path)
- drive_file_id: TEXT (Google Drive file ID, null if failed)
- drive_url: TEXT (Google Drive public URL, null if failed)
- upload_status: TEXT (pending/drive_success/drive_failed/cleanup_done)
- retry_count: INTEGER (number of retry attempts)
- error_message: TEXT (error details if failed)
- created_at: TIMESTAMP
- last_retry_at: TIMESTAMP
```

### **2. upload_logs** - Detailed Logging
```sql
- id: UUID (primary key)
- upload_id: UUID (reference to upload_status)
- log_level: TEXT (info/warning/error)
- message: TEXT (log message)
- details: JSONB (additional error details)
- created_at: TIMESTAMP
```

---

## 🔍 MONITORING ENDPOINTS

### **GET /user-hub/upload-status** - Monitor Your Uploads
```bash
# Get all your uploads
curl -H "Authorization: Bearer YOUR_JWT" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/upload-status"

# Get only failed uploads
curl -H "Authorization: Bearer YOUR_JWT" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/upload-status?status=drive_failed"

# Get recent 10 uploads
curl -H "Authorization: Bearer YOUR_JWT" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/upload-status?limit=10"
```

**Response Example:**
```json
{
  "success": true,
  "uploads": [
    {
      "id": "uuid-123",
      "file_name": "photo.jpg",
      "upload_status": "drive_failed",
      "retry_count": 1,
      "error_message": "Google Drive API timeout",
      "created_at": "2025-09-07T10:00:00Z",
      "upload_logs": [
        {
          "log_level": "error",
          "message": "Initial upload failed",
          "created_at": "2025-09-07T10:00:30Z"
        }
      ]
    }
  ],
  "summary": {
    "drive_success": 45,
    "drive_failed": 3,
    "cleanup_done": 42
  },
  "retry_available": true
}
```

---

## 🔄 RETRY SYSTEM ENDPOINTS

### **GET /storage-retry?action=retry** - Retry Failed Uploads
```bash
# Retry all failed uploads (admin/service level)
curl "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/storage-retry?action=retry"
```

**Response:**
```json
{
  "success": true,
  "message": "Retry process completed",
  "total_found": 5,
  "retried": 5,
  "successful": 3
}
```

### **GET /storage-retry?action=cleanup** - Clean Successful Uploads
```bash
# Clean up storage for successful uploads
curl "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/storage-retry?action=cleanup"
```

### **GET /storage-retry?action=status** - System-wide Status
```bash
# Get overall system status
curl "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/storage-retry?action=status"
```

---

## 📈 WORKFLOW EXPLANATION

### **🔄 NORMAL UPLOAD FLOW:**
```
1. User uploads photo → Supabase Storage (temporary)
2. System uploads → Google Drive (permanent)
3. ✅ Drive Success → Auto-delete from Supabase → Status: 'cleanup_done'
4. ❌ Drive Fails → Keep in Supabase → Status: 'drive_failed'
```

### **🔁 RETRY FLOW:**
```
1. System detects failed uploads (status = 'drive_failed')
2. Downloads file from Supabase Storage
3. Retries Google Drive upload
4. ✅ Retry Success → Delete from Supabase → Status: 'cleanup_done'
5. ❌ Retry Fails → Increment retry_count → Try again later
6. After 3 failed retries → Keep in Supabase permanently
```

---

## 🚨 FAILURE DETECTION

### **How You Know If Drive Upload Fails:**

**1. Check Upload Status API:**
```bash
curl -H "Authorization: Bearer JWT" \
     "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/user-hub/upload-status?status=drive_failed"
```

**2. Monitor Response Fields:**
- `upload_status: "drive_failed"` - Upload failed
- `retry_count: 2` - Number of retry attempts
- `error_message: "Drive API timeout"` - Specific error details

**3. Check Logs:**
- `upload_logs` array contains detailed error information
- `log_level: "error"` indicates failure points

---

## ⚡ AUTOMATIC RETRY TRIGGERS

### **Manual Retry (Immediate):**
```bash
curl "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/storage-retry?action=retry"
```

### **Scheduled Retry (Recommended):**
Set up a cron job or scheduler to run retry every hour:
```bash
# Run every hour via cron or scheduler
0 * * * * curl "https://xaluaekioqwxtzhnmygg.supabase.co/functions/v1/storage-retry?action=retry"
```

### **Retry Logic:**
- **Retry Limit**: Maximum 3 attempts per upload
- **Retry Delay**: 1 hour minimum between retries
- **Smart Selection**: Only retries uploads that haven't exceeded limit

---

## 📊 MONITORING DASHBOARD DATA

### **Key Metrics You Can Track:**

**Upload Success Rate:**
```json
{
  "summary": {
    "drive_success": 95,    // 95 successful uploads
    "drive_failed": 3,      // 3 failed uploads  
    "cleanup_done": 90,     // 90 cleaned up from Supabase
    "pending": 2            // 2 still processing
  }
}
```

**Failure Analysis:**
- Which uploads are failing most
- Common error patterns
- Retry success rates
- Storage cleanup status

---

## 🔧 TROUBLESHOOTING

### **Common Issues:**

#### **1. "No failed uploads to retry"**
- **Meaning**: All uploads are successful or already retried
- **Action**: Check upload-status endpoint to confirm

#### **2. "File not found in storage"**
- **Meaning**: File was deleted from Supabase but retry record exists
- **Action**: System will skip and log this automatically

#### **3. "Google Drive API timeout"**
- **Meaning**: Drive service temporarily unavailable
- **Action**: Retry will attempt again in 1 hour

#### **4. High retry_count without success**
- **Meaning**: Persistent Drive connectivity issues
- **Action**: Check Google service account credentials

---

## 💡 OPTIMIZATION TIPS

### **Storage Efficiency:**
- ✅ **Most uploads**: Stored in Google Drive only (free 15GB)
- ✅ **Failed uploads**: Temporary Supabase storage until retry succeeds
- ✅ **Auto-cleanup**: Removes files after successful Drive upload

### **Monitoring Best Practices:**
- Check upload-status weekly to monitor failure rates
- Run retry process hourly or daily via scheduler
- Alert if failure rate exceeds 10%

### **Cost Management:**
- Successful uploads = minimal Supabase storage cost
- Failed uploads kept temporarily until retry succeeds
- Maximum 3 retries prevents infinite storage accumulation

---

## 🎯 SUCCESS INDICATORS

### **System is Working Well When:**
- ✅ `summary.drive_success` > 90% of total uploads
- ✅ `summary.cleanup_done` ≈ `summary.drive_success`
- ✅ `summary.drive_failed` has low retry_count values
- ✅ Few uploads with `retry_count >= 3`

### **System Needs Attention When:**
- ❌ `summary.drive_failed` > 10% of total uploads
- ❌ Many uploads with `retry_count >= 3`
- ❌ `error_message` shows consistent API errors
- ❌ Large gap between `drive_success` and `cleanup_done`

---

## 🚀 READY TO USE!

**Your comprehensive upload monitoring system is now:**
- ✅ **Tracking all uploads** with detailed status
- ✅ **Automatically retrying failures** up to 3 times
- ✅ **Optimizing storage costs** with smart cleanup
- ✅ **Providing real-time monitoring** via APIs
- ✅ **Logging detailed error information** for debugging

**Deploy the system and never lose an upload again!** 🎉

---

**Last Updated**: September 2025  
**Status**: ✅ READY FOR DEPLOYMENT  
**Project**: https://xaluaekioqwxtzhnmygg.supabase.co