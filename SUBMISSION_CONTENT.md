
# EY Techathon 6.0 - Detailed Submission
## RepurposeIQ: Agentic AI for Pharmaceutical Innovation

---

### [SLIDE 4] Executive Summary
**RepurposeIQ** is an enterprise-grade **Agentic AI Platform** designed to revolutionize the **drug repurposing** lifecycle. By addressing the critical bottleneck of information silos in pharmaceutical R&D, RepurposeIQ reduces the early-stage research timeline from months to minutes.

Our solution leverages a **Hybrid Agentic Architecture** that orchestrates specialized **Worker Agents** (Clinical, Patent, Market, Literature, and Internal Knowledge) via **LangGraph**, enabling complex cognitive workflows that mimic human expert reasoning. Unlike standard LLM wrappers, RepurposeIQ utilizes **RAG (Retrieval-Augmented Generation)** with **ChromaDB** to synthesize insights from trusted sources like **PubMed, ClinicalTrials.gov**, and proprietary internal documents, ensuring high-fidelity, hallucination-resistant outputs.

**Key Innovations**:
1. **Multi-Step Reasoning**: Decomposes abstract strategies (e.g., "Find whitespace for Metformin") into executable sub-tasks (Patent Check -> Clinical Evidence -> Market Sizing).
2. **Regulatory Governance**: Built-in "Regulatory Readiness" and "Patent Risk" scoring models to align AI suggestions with compliance standards (FDA/EMA).
3. **Real-Time Synthesis**: Generates comprehensive PDF reports with consolidated "Product Stories", reducing manual compilation effort by 95%.

RepurposeIQ transforms generic data into actionable **Pharmaceutical Intelligence**, empowering R&D teams to identify high-potential, low-risk repurposing opportunities with unprecedented speed and accuracy.

---

### [SLIDE 5] Problem Statement - Your Understanding

| Field | Detail |
| :--- | :--- |
| **Target Industry** | **Pharmaceuticals & Life Sciences** |
| **Industry Type** | **B2B (Enterprise R&D)** |
| **User Group** | **R&D Planners, Strategy Leads, Clinical Researchers** |
| **User Department** | **Innovation / Portfolio Management / R&D** |
| **Solution Scenario** | A researcher inputs a query (e.g., *"Find new indications for Sitagliptin with low competition"*). The **Master Agent** parses intent, delegates to **Clinical Agent** (for efficacy), **Patent Agent** (for FTO), and **Market Agent** (for commercial viability). The system synthesizes these cross-domain insights into a unified strategy report. |
| **Proposed Data Flow** | User Query -> **Orchestration Layer (LangGraph)** -> Parallel Execution of **Worker Agents** -> External APIs (PubMed, USPTO, CT.gov) & Internal Vector DB -> **Evidence Validation Layer** -> Synthesis -> **User Interface (React)** & PDF Report. |
| **Nature of Output** | **Interactive Web Application** (Dashboard + Chat) & **Downloadable Strategic Reports (PDF/Excel)** |

**Define the Exact Problem**:
Pharmaceutical companies face a "Data Rich, Insight Poor" paradox. Identifying viable drug repurposing candidates requires synthesizing vast, disconnected datasets (clinical trials, patents, market data, scientific literature). This manual process takes 2-3 months per molecule, slowing down innovation handling. The challenge is to build an **Agentic AI** that autonomously navigates these disparate sources to uncover "Hidden Gems" (high-value repurposing opportunities) with speed, accuracy, and regulatory awareness.

---

### [SLIDE 6] Approach and Methodology

**1. Value Proposition:**
RepurposeIQ acts as a "Force Multiplier" for R&D teams. It automates the 80% of time spent on data gathering and synthesis, allowing experts to focus on the 20% of high-value decision making. It minimizes "False Starts" by flagging Patent/Regulatory risks early in the exploration phase.

**2. Impact Metrics:**
- **Time Reduction**: Research cycle reduced from **8-12 weeks** to **<1 hour**.
- **Throughput**: Increase candidate evaluation capacity by **10x**.
- **Accuracy**: **High Confidence** citations linked to every insight (Zero-trust verify model).

**3. Technologies Involved:**
- **Frontend**: **React.js**, **TailwindCSS** (Responsive, Professional Dashboard).
- **Backend Orchestration**: **Python (FastAPI)** with **LangGraph** & **LangChain** for stateful agent workflows.
- **AI/ML**: **Groq** (Llama 3 70B for speed), **HuggingFace** Transformers (Local Embeddings), **ChromaDB** (Vector Store/RAG).
- **Integration**: **Express.js** API Gateway, **WebSocket** for real-time streaming.

**4. Assumptions & Constraints:**
- **Assumption**: API access to structured databases (ClinicalTrials.gov, IPO) is available or mocks represent realistic data structures.
- **Constraint**: Real-time analysis of millions of patents requires caching strategies (Redis) to maintain performance.
- **Decision**: Used **LangGraph** over simple chains to enable cyclic/corrective reasoning (e.g., if Patent search fails, retry with different keywords).

**5. Implementation & Effectiveness:**
The solution is containerized (Docker) for rapid on-premise or cloud deployment. Its modular "Worker Agent" design allows adding new data sources (e.g., Genomics DB) without rewriting the core logic, ensuring long-term adaptability.

**6. Robustness, Security & Scalability:**
- **Security**: JWT Authentication, Role-Based Access Control (RBAC), and logical separation of Internal vs. External data.
- **Scalability**: Asynchronous agent execution (Python `asyncio`) ensures the UI remains responsive even during deep research tasks. Microservices architecture allows independent scaling of memory-intensive agents.

**7. Components to Demonstrate:**
- **Interactive Chat Interface**: Real-time agent thought process visualization ("Thinking... Searching PubMed...").
- **Dynamic Dashboard**: Visualizing Market Size vs. Competition heatmaps.
- **Report Generator**: One-click export of the "Innovation Story" PDF.

---

### [SLIDE 7 - ATTACHMENT TEXT] Architecture & Flow

**Architecture Diagram Description:**
A **Client-Server-Microservice** Hybrid.
- **Client**: React SPA communicating via HTTP/WebSocket.
- **Gateway**: Node.js Server handles Auth, Rate Limiting, and Routing.
- **Brain**: Python Service hosts the **LangGraph Orchestrator**.
- **Memory**: Redis (Short-term), ChromaDB (Long-term Knowledge).
- **Tools**: Specialized modules for Web Search, Database Querying, and Document Parsing.

**Process Flow:**
1. **Intent Recognition**: Classifier determines if query is "Exploratory", "Verification", or "Comparison".
2. **Task Decomposition**: Master Agent breaks intent into sub-tasks (e.g., [Search Clinical], [Check Patent]).
3. **Parallel Execution**: Agents execute tools simultaneously.
4. **Validation**: "Critic" Step checks if evidence supports the hypothesis.
5. **Synthesis**: LLM compiles valid findings into a narrative.
