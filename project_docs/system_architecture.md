# FarmPay AI — System Architecture Specification

**Version:** 2.0.0  
**Updated:** 2026-11-05  

---

## 1. High-Level Architecture Overview

FarmPay AI follows a clean, decoupled three-tier architecture optimized for mobile resilience and low-latency operation in rural connectivity environments:

```
[ Mobile Browser / PWA (React 19 + Vite) ]
                    |
           HTTPS REST API / JSON
                    v
    [ FastAPI Backend Application ]
       |            |             |
       v            v             v
[ MySQL 8.0 ] [ Gemini AI ] [ Qiskit QAOA ]
 (InnoDB)      (Vernacular)   (Benchmarking)
```

---

## 2. Core Subsystems

### 2.1 Frontend Subsystem (React 19)
- **State Management:** Local component state paired with lightweight Context API for global session and language state.
- **Routing:** Declarative client-side routing via `react-router-dom` v7.
- **Mobile Design System:** 360px minimum viewport grid, 48px touch targets, WCAG AAA contrast ratio, Telugu Unicode NFC normalization.

### 2.2 Backend Subsystem (FastAPI)
- **API Engine:** Async FastAPI with Pydantic v2 data validation schemas.
- **Database Access:** PyMySQL using DictCursor, explicit transaction management (`autocommit=False`), and pessimistic row-level locking (`FOR UPDATE`).
- **Payment Provider:** PayPal REST API v2 Sandbox with strict separation of order identity vs. capture amount validation.

### 2.3 AI & Quantum Innovation Layer
- **Gemini Vernacular Engine:** Structured entity extraction from Telugu/Hindi/English speech input, bounded by the verified MySQL crop catalog.
- **Quantum Optimization Lab:** QUBO formulation of multi-farmer to multi-buyer supply allocation executed on Qiskit Aer simulators and benchmarked against classical ILP baselines.
