# 🎬 Demo Production Guide - EY Techathon

**Complete guide for producing the 4-minute demo video**

---

## 📋 PRE-PRODUCTION CHECKLIST

### 1. Environment Setup

#### Backend
```bash
# Terminal 1: Start backend
cd "/Users/akashsingh/Downloads/RepurposeIQ 2"
npm run server
# Keep this terminal visible for logs
```

#### Frontend
```bash
# Terminal 2: Start frontend
cd "/Users/akashsingh/Downloads/RepurposeIQ 2/client"
npm run dev
# Opens on http://localhost:5173
```

#### Verify
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Backend logs visible in Terminal 1
- [ ] Can login (demo/demo)
- [ ] Chat page loads

---

### 2. Test Query Preparation

#### Primary Query (Recommended)
```
Find repurposing opportunities for Sitagliptin
```

#### Backup Queries (If needed)
```
Find repurposing opportunities for Metformin
```

```
How would you identify the best repurposing candidate among 10 approved molecules for a new CNS indication?
```

#### Test Before Recording
1. Submit query
2. Verify agents execute
3. Verify backend logs appear
4. Verify report generation works
5. Note any delays or issues

---

### 3. Screen Recording Setup

#### Software Options
- **Mac:** QuickTime Player (built-in)
- **Windows:** OBS Studio (free, professional)
- **Cross-platform:** Loom, ScreenFlow

#### Settings
- **Resolution:** 1920x1080 (or native)
- **Frame Rate:** 30fps (minimum)
- **Audio:** Record system audio + microphone
- **Format:** MP4 (H.264)

#### Layout Recommendation
- **Option A:** Full screen switching (cleanest)
- **Option B:** Split screen (frontend + backend)
- **Option C:** Picture-in-Picture (frontend main, backend small)

**Recommended:** Option A (full screen switching)

---

### 4. Audio Setup

#### Microphone
- Use external microphone if available
- Test audio levels before recording
- Record in quiet environment
- Speak clearly and confidently

#### Audio Levels
- Test: Record 10 seconds, check volume
- Adjust: Not too loud, not too quiet
- Background: Minimize background noise

---

## 🎬 RECORDING WORKFLOW

### Step 1: Pre-Recording Setup (5 minutes)

1. **Open Applications:**
   - Browser (Chrome/Firefox) - Frontend
   - Terminal 1 - Backend logs
   - Terminal 2 - (Optional) Frontend dev server
   - Screen recorder

2. **Position Windows:**
   - Browser: Full screen (or 70% if split screen)
   - Terminal: Visible (30% if split screen, or ready to switch)
   - Screen recorder: Start but don't record yet

3. **Login:**
   - Navigate to http://localhost:5173
   - Login: `demo` / `demo`
   - Navigate to Chat page
   - Clear any previous messages (if needed)

4. **Verify Backend:**
   - Check Terminal 1 for backend logs
   - Verify: `🚀 Server running on http://localhost:3000`
   - Test: Visit http://localhost:3000/api/health

---

### Step 2: Recording (4 minutes)

#### Follow the Script (`EY_TECHATHON_DEMO_SCRIPT.md`)

**Key Moments to Capture:**

1. **0:00-0:30** - Introduction
   - Home page
   - Problem statement
   - Solution overview

2. **0:30-1:00** - Architecture
   - Chat interface
   - Master Agent concept
   - Transition to demo

3. **1:00-1:40** - Query & Master Agent
   - Type query
   - Show backend logs (Master Agent receiving)
   - Show task dispatch

4. **1:40-2:40** - Worker Agents
   - Show each agent output
   - Show backend logs for each agent
   - Highlight structured data

5. **2:40-3:15** - Decision Logic
   - Show synthesis
   - Show reasoning
   - Show final analysis

6. **3:15-3:40** - Report Generation
   - Click generate report
   - Show backend logs
   - Show PDF (if possible)

7. **3:40-4:00** - Closing
   - Summary
   - Final shot

---

### Step 3: Post-Recording (10 minutes)

#### Review Recording
1. Watch full video
2. Check audio clarity
3. Check visual clarity
4. Verify all key moments captured
5. Note any issues

#### Edit (If Needed)
- **Trim:** Remove dead time at start/end
- **Cut:** Remove mistakes (if any)
- **Enhance:** Add text overlays (optional)
- **Audio:** Adjust levels if needed

#### Export
- **Format:** MP4
- **Resolution:** 1920x1080
- **Quality:** High (for YouTube/upload)
- **File size:** Should be reasonable (<500MB for 4 minutes)

---

## 🎯 KEY VISUALS CHECKLIST

### Must Show:

- [ ] **Home/Landing Page** - Project introduction
- [ ] **Chat Interface** - Main interaction point
- [ ] **Query Input** - User typing query
- [ ] **Backend Logs** - Master Agent receiving prompt
- [ ] **Backend Logs** - Task dispatch to agents
- [ ] **Frontend** - Agent outputs (tables/data)
- [ ] **Backend Logs** - Agent completion logs
- [ ] **Frontend** - Strategic reasoning/analysis
- [ ] **Frontend** - Final synthesized response
- [ ] **Frontend** - Report generation button
- [ ] **Backend Logs** - Report generation logs
- [ ] **Frontend** - PDF download/confirmation

---

## 📝 NARRATION SCRIPT HIGHLIGHTS

### Key Phrases to Emphasize:

1. **"Agentic AI"** - Not chatbot
2. **"Master Agent orchestrates"** - Show logs
3. **"Worker Agents execute"** - Show outputs
4. **"Decision logic"** - Show reasoning
5. **"As required in EY problem statement"** - Connect to requirements
6. **"End-to-end workflow"** - Show complete flow
7. **"Real backend execution"** - Show logs

### Pacing:
- **Slow and clear** - Don't rush
- **Pause** - After key points
- **Emphasize** - Important terms

---

## 🎬 RECORDING TIPS

### Do's:
✅ Practice once before recording  
✅ Speak clearly and confidently  
✅ Show backend logs (proof of execution)  
✅ Highlight Master Agent orchestration  
✅ Show multiple agent outputs  
✅ Demonstrate decision logic  
✅ Show report generation  
✅ Keep to 4 minutes (strict)  

### Don'ts:
❌ Rush through visuals  
❌ Skip backend logs  
❌ Use generic chatbot language  
❌ Forget to show report generation  
❌ Miss decision logic/reasoning  
❌ Go over 4 minutes  

---

## 🎥 SCREEN RECORDING SETTINGS

### QuickTime (Mac)
1. File → New Screen Recording
2. Click record button
3. Select area (full screen or window)
4. Click record
5. Stop: Cmd+Ctrl+Esc

### OBS Studio (Cross-platform)
1. Add "Display Capture" source
2. Add "Audio Input Capture" (microphone)
3. Add "Audio Output Capture" (system audio)
4. Click "Start Recording"
5. Stop: Click "Stop Recording"

### Settings:
- **Resolution:** 1920x1080
- **Frame Rate:** 30fps
- **Bitrate:** 5000 kbps (for quality)
- **Format:** MP4

---

## 📊 TIMING REFERENCE

| Time | Action | Visual |
|------|--------|--------|
| 0:00 | Start | Home page |
| 0:30 | Architecture | Chat interface |
| 1:00 | Type query | Query input |
| 1:10 | Show logs | Backend terminal |
| 1:40 | Show agents | Agent outputs |
| 2:40 | Show synthesis | Final response |
| 3:15 | Generate report | Report button |
| 3:40 | Closing | Summary |

---

## ✅ FINAL CHECKLIST

Before submitting:

- [ ] Video is exactly 4 minutes (or under)
- [ ] All key visuals shown
- [ ] Backend logs visible
- [ ] Audio is clear
- [ ] Video quality is good
- [ ] All EY requirements demonstrated
- [ ] Master Agent shown
- [ ] Worker Agents shown
- [ ] Decision logic shown
- [ ] Report generation shown
- [ ] End-to-end flow complete

---

## 🚀 READY TO RECORD

**Status:** ✅ All preparation complete

**Next Steps:**
1. Set up recording environment
2. Start backend and frontend
3. Test query once
4. Record following script
5. Review and submit

**Good luck with your demo! 🎬**
