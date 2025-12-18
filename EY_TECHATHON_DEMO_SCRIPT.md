# 🎬 EY Techathon 6.0 - Demo Video Script

**Project:** RepurposeIQ - Intelligent Drug Repurposing Platform  
**Team Lead:** Akash Kumar Singh  
**Duration:** 4 minutes (strict)  
**Objective:** Demonstrate working Agentic AI system that fulfills EY problem statement

---

## 📋 PRE-RECORDING CHECKLIST

### Backend Setup
- [ ] Backend running on `localhost:3000`
- [ ] Terminal with logs visible (for backend screenshots)
- [ ] Database initialized
- [ ] All environment variables set (GROQ_API_KEY, etc.)

### Frontend Setup
- [ ] Frontend running on `localhost:5173`
- [ ] User logged in (demo/demo)
- [ ] Chat page ready
- [ ] Dashboard page accessible

### Test Query Prepared
- [ ] Query: "Find repurposing opportunities for Sitagliptin"
- [ ] Alternative: "How would you identify the best repurposing candidate among 10 approved molecules for a new CNS indication?"

### Screen Recording
- [ ] Screen recorder ready (OBS, QuickTime, etc.)
- [ ] Audio recording ready (clear microphone)
- [ ] Screen resolution: 1920x1080 (or higher)
- [ ] Browser zoom: 100% (no zoom)

---

## 🎬 VIDEO SCRIPT (4:00 MINUTES)

### 🔹 PART 1: INTRODUCTION (0:00 – 0:30)

#### 🎙️ NARRATION

> "Hello, I'm Akash Kumar Singh, Team Lead.
> 
> This is **RepurposeIQ**, an Agentic AI platform built for **EY Techathon 6.0** to solve pharmaceutical drug repurposing challenges.
> 
> Currently, identifying repurposing opportunities takes **2-3 months** due to manual research across clinical trials, patents, market data, and literature.
> 
> Our solution reduces this to **minutes** using coordinated AI agents."

#### 🖥️ VISUALS TO SHOW

**0:00-0:10** - Home Screen
- Show: Landing page with "RepurposeIQ" title
- Highlight: "Intelligent Drug Repurposing Platform"
- Show: Navigation menu (Dashboard, Chat, Analytics, etc.)

**0:10-0:20** - Problem Statement
- Show: Dashboard or Home page
- Highlight: Key statistics (if visible)
- Narrate problem while showing UI

**0:20-0:30** - Solution Overview
- Show: Chat interface (empty state)
- Highlight: "AI-powered analysis" messaging
- Transition to next section

---

### 🔹 PART 2: PROBLEM → SOLUTION MAPPING (0:30 – 1:00)

#### 🎙️ NARRATION

> "EY's problem statement asks for an **Agentic AI solution** where a **Master Agent** coordinates multiple domain-specific agents, integrates data sources, and generates decision-ready reports.
> 
> **RepurposeIQ directly implements this architecture.**
> 
> Let me show you how it works with a real query."

#### 🖥️ VISUALS TO SHOW

**0:30-0:40** - Architecture Overview
- Show: Chat page
- Point to: Query input box
- Narrate: "User submits query → Master Agent → Worker Agents"

**0:40-0:50** - Master Agent Concept
- Show: Chat interface
- Highlight: "Master Agent orchestrates 8 specialized agents"
- Show: Agent list (if visible in UI) or mention verbally

**0:50-1:00** - Transition to Live Demo
- Show: Typing cursor in query box
- Prepare to type: "Find repurposing opportunities for Sitagliptin"

---

### 🔹 PART 3: LIVE QUERY & MASTER AGENT (1:00 – 1:40)

#### 🎙️ NARRATION

> "Let's start with a real strategic query.
> 
> The user asks: **'Find repurposing opportunities for Sitagliptin.'**
> 
> [Type query and press Enter]
> 
> The **Master Agent** interprets the intent and breaks it into tasks.
> 
> Watch the backend logs—you'll see the Master Agent receiving the prompt, identifying intent, and dispatching tasks to worker agents."

#### 🖥️ VISUALS TO SHOW

**1:00-1:10** - Typing Query
- Show: Chat interface
- Type: "Find repurposing opportunities for Sitagliptin"
- Press Enter
- Show: Query appears in chat

**1:10-1:20** - Backend Logs (SPLIT SCREEN or CUT)
- Show: Terminal with backend logs
- Highlight these logs:
  ```
  [MasterAgent] Prompt received
  [MasterAgent] User ID: ...
  [MasterAgent] Query: Find repurposing opportunities for Sitagliptin
  [MasterAgent] Intent identified: Drug Repurposing
  [MasterAgent] Dispatching tasks to worker agents...
  ```

**1:20-1:30** - Master Agent Decision Flow
- Show: Frontend - MasterAgentDecisionFlow component (if visible)
- OR show: Backend logs showing task decomposition
- Narrate: "Master Agent breaks query into subtasks"

**1:30-1:40** - Agent Dispatch
- Show: Backend logs:
  ```
  [MasterAgent] Dispatching task → ClinicalAgent
  [MasterAgent] Dispatching task → PatentAgent
  [MasterAgent] Dispatching task → MarketAgent
  [MasterAgent] Dispatching task → WebAgent
  ```
- Narrate: "Master Agent delegates to specialized agents"

---

### 🔹 PART 4: WORKER AGENTS IN ACTION (1:40 – 2:40)

#### 🎙️ NARRATION

> "The Master Agent now delegates work to specialized agents—exactly as required in the EY problem statement.
> 
> **The Clinical Trials Agent** checks ongoing trials and identifies repurposing opportunities.
> 
> **The Patent Agent** checks patent expiry and freedom-to-operate risks.
> 
> **The Market Agent** analyzes competition and market size using IQVIA-style data.
> 
> **The Web Intelligence Agent** fetches guidelines and publications.
> 
> Each agent executes in parallel and returns structured data."

#### 🖥️ VISUALS TO SHOW

**1:40-1:55** - Clinical Agent Output
- Show: Frontend - AgentOutputDisplay component
- Highlight: Clinical trials table/data
- Show: Backend log: `[ClinicalAgent] ✓ Analysis complete`
- Show: Trial data (phase, sponsor, indication)

**1:55-2:10** - Patent Agent Output
- Show: Frontend - Patent data
- Highlight: Patent expiry dates, FTO risk
- Show: Backend log: `[PatentAgent] ✓ Analysis complete`
- Show: Patent table (expiry year, status)

**2:10-2:25** - Market Agent Output
- Show: Frontend - Market data
- Highlight: Market size, CAGR, competition
- Show: Backend log: `[MarketAgent] ✓ Analysis complete`
- Show: Market table (CAGR, competition density)

**2:25-2:40** - Web Agent & Others
- Show: Frontend - Web citations/links
- Show: Backend logs for all agents:
  ```
  [WebAgent] ✓ Analysis complete
  [SocialAgent] ✓ Analysis complete
  [CompetitorAgent] ✓ Analysis complete
  ```
- Narrate: "All agents complete their analysis"

---

### 🔹 PART 5: DECISION LOGIC & SYNTHESIS (2:40 – 3:15)

#### 🎙️ NARRATION

> "The Master Agent now synthesizes all outputs using **strategic decision logic**.
> 
> For example:
> - **High patient burden** + **Low late-stage trials** = Unmet need
> - **Near-term patent expiry** = Opportunity window
> - **Low competition** = Feasibility
> 
> This indicates a clear repurposing opportunity.
> 
> The system doesn't just aggregate data—it **analyzes, reasons, and provides expert insights**."

#### 🖥️ VISUALS TO SHOW

**2:40-2:50** - Synthesis Process
- Show: Backend log:
  ```
  [MasterAgent] Synthesizing results...
  [MasterAgent] Applying decision logic...
  ```
- Show: Frontend - StrategicReasoning component (if visible)
- Highlight: Decision factors

**2:50-3:00** - Final Analysis
- Show: Frontend - Final synthesized response
- Highlight: Key insights, reasoning bullets
- Show: Decision factors (Unmet Need, Patent Opportunity, etc.)

**3:00-3:15** - Expert Insights
- Show: Frontend - Complete response
- Highlight: "Final Recommendation" section
- Highlight: Confidence score
- Show: Structured analysis (not just data listing)

---

### 🔹 PART 6: REPORT GENERATION (3:15 – 3:40)

#### 🎙️ NARRATION

> "Finally, the **Report Generator Agent** creates a downloadable PDF—ready for internal review and archival.
> 
> This satisfies EY's requirement for structured, saved outputs.
> 
> [Click Generate Report button]
> 
> The system generates a comprehensive PDF report with all agent outputs, decision logic, and recommendations."

#### 🖥️ VISUALS TO SHOW

**3:15-3:25** - Generate Report
- Show: Frontend - "Generate Report" or "Download PDF" button
- Click the button
- Show: Loading state / "Generating report..."

**3:25-3:35** - Report Generation Logs
- Show: Backend log:
  ```
  [ReportGenerator] PDF generation requested
  [ReportGenerator] Title: Pharma Strategy Analysis
  [ReportGenerator] Saving to: /tmp/reports/report_XXXXX.pdf
  [ReportGenerator] ✓ PDF created successfully
  ```

**3:35-3:40** - PDF Preview
- Show: PDF file opened (if possible)
- OR show: Download confirmation
- Highlight: Report contains agent outputs, analysis, recommendations

---

### 🔹 PART 7: CLOSING (3:40 – 4:00)

#### 🎙️ NARRATION

> "**RepurposeIQ is not a chatbot—it is a digital pharma strategist.**
> 
> It demonstrates:
> - ✅ **Real Agentic AI orchestration** (Master Agent + 8 Workers)
> - ✅ **End-to-end workflow** (Query → Agents → Synthesis → Report)
> - ✅ **Decision-ready insights** (Not just data aggregation)
> - ✅ **Working backend** (Visible logs, real execution)
> 
> This directly fulfills the **EY Techathon problem statement.**
> 
> Thank you."

#### 🖥️ VISUALS TO SHOW

**3:40-3:50** - Summary Slide (OPTIONAL)
- Show: Summary slide with checkmarks:
  - ✅ Agentic AI Architecture
  - ✅ Master Agent Orchestration
  - ✅ 8 Worker Agents
  - ✅ Decision Logic
  - ✅ PDF Report Generation
  - ✅ End-to-End Demo

**3:50-4:00** - Final Shot
- Show: RepurposeIQ logo/title
- OR show: Chat interface with completed query
- Fade out

---

## 🎯 KEY VISUALS TO CAPTURE

### Frontend Screenshots Needed:
1. ✅ Home/Landing page
2. ✅ Chat interface (empty state)
3. ✅ Query input and submission
4. ✅ Agent outputs (tables, data)
5. ✅ Strategic reasoning display
6. ✅ Master Agent decision flow (if visible)
7. ✅ Final synthesized response
8. ✅ Report generation button
9. ✅ PDF download/confirmation

### Backend Logs to Show:
1. ✅ `[MasterAgent] Prompt received`
2. ✅ `[MasterAgent] Intent identified`
3. ✅ `[MasterAgent] Dispatching tasks`
4. ✅ `[ClinicalAgent] ✓ Analysis complete`
5. ✅ `[PatentAgent] ✓ Analysis complete`
6. ✅ `[MarketAgent] ✓ Analysis complete`
7. ✅ `[MasterAgent] Synthesizing results`
8. ✅ `[ReportGenerator] ✓ PDF created successfully`

---

## 📝 NARRATION TIPS

### Voice Style:
- **Confident** - You built this, own it
- **Clear** - Speak slowly, enunciate
- **Professional** - But not robotic
- **Enthusiastic** - Show passion for the solution

### Pacing:
- **Don't rush** - Judges prefer clarity over speed
- **Pause** - After key points (let visuals sink in)
- **Emphasize** - "Master Agent", "Worker Agents", "Decision Logic"

### Key Phrases to Use:
- "As required in the EY problem statement"
- "Real Agentic AI orchestration"
- "Not just data aggregation—expert analysis"
- "Decision-ready insights"
- "Working backend with visible execution"

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ DON'T:
- Rush through visuals
- Skip backend logs (judges want proof)
- Just show frontend (must show backend working)
- Use generic chatbot language
- Forget to show report generation
- Miss the decision logic/reasoning

### ✅ DO:
- Show backend logs clearly
- Highlight Master Agent orchestration
- Show multiple agent outputs
- Demonstrate decision logic
- Show PDF generation
- Emphasize "Agentic AI" not "chatbot"

---

## 🎬 RECORDING SETUP

### Screen Layout Options:

**Option 1: Split Screen**
- Left: Frontend (70%)
- Right: Backend logs (30%)

**Option 2: Full Screen Switching**
- Frontend for UI actions
- Backend logs for agent execution
- Switch between as needed

**Option 3: Picture-in-Picture**
- Main: Frontend
- Small window: Backend logs (bottom-right)

### Recommended:
- **Option 2** (Full screen switching) - Cleaner, easier to follow
- Switch to backend logs during agent execution
- Switch back to frontend for results

---

## 📊 TIMING BREAKDOWN

| Section | Start | End | Duration | Key Visual |
|---------|-------|-----|----------|------------|
| Introduction | 0:00 | 0:30 | 30s | Home page |
| Problem → Solution | 0:30 | 1:00 | 30s | Architecture |
| Live Query | 1:00 | 1:40 | 40s | Query + Master Agent logs |
| Worker Agents | 1:40 | 2:40 | 60s | Agent outputs |
| Decision Logic | 2:40 | 3:15 | 35s | Synthesis + Reasoning |
| Report Generation | 3:15 | 3:40 | 25s | PDF generation |
| Closing | 3:40 | 4:00 | 20s | Summary |

**Total: 4:00 minutes**

---

## ✅ EY REQUIREMENTS CHECKLIST

Ensure these are **visibly demonstrated**:

- [x] **Master Agent** - Orchestrates tasks (show logs)
- [x] **Worker Agents** - Multiple agents execute (show outputs)
- [x] **Data Integration** - Multiple data sources (show tables)
- [x] **Decision Logic** - Not just data, but reasoning (show analysis)
- [x] **Report Generation** - PDF/Excel output (show generation)
- [x] **End-to-End Flow** - Complete workflow (show all steps)
- [x] **Backend Working** - Real execution (show logs)
- [x] **Visible Reasoning** - Strategic insights (show reasoning component)

---

## 🎯 FINAL TIPS

1. **Practice once** - Run through the demo before recording
2. **Have backup query** - If Sitagliptin doesn't work, use Metformin
3. **Check logs** - Ensure backend logs are visible and clear
4. **Test report** - Ensure PDF generation works
5. **Clear audio** - Use good microphone, quiet environment
6. **Steady pace** - Don't rush, judges prefer clarity

---

## 🚀 READY TO RECORD

**Status:** ✅ Script complete, ready for recording

**Next Steps:**
1. Set up screen recording
2. Start backend and frontend
3. Test query once
4. Record demo following this script
5. Review and edit if needed

**Good luck! 🎬**
