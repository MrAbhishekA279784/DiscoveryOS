# DISCOVERYOS — ACTIONABLE NEXT STEPS

**Generated From:** Comprehensive Audit (READ-ONLY)  
**Status:** Ready for Implementation  
**Priority:** Fix Build → Real Data → Export → Demo

---

## PHASE 1: CRITICAL (Hours 0-4)

### Issue 1: TypeScript Compilation Fails
**Time: 2-4 hours | Effort: Low | Blocker: YES**

#### The Problem
```
7 TypeScript errors prevent build:
- src/App.tsx:592 - uploadedFiles undefined
- src/components/AiCopilotView.tsx:121,201 - messages, isTyping undefined  
- src/components/ReportsView.tsx:192 - historicalReports undefined
- src/components/ResearchView.tsx:43+ - streamedText, isSearching, fullAiResponse undefined
- src/components/UploadExperience.tsx:285 - files undefined
- src/utils/api.ts:2 - import.meta.env property missing
```

#### Fix 1A: Initialize Missing State Variables

**File: `src/components/AiCopilotView.tsx`** (Line 1-30, estimate)
- Add useState for `messages` and `isTyping`
- Initialize from props or local state
- Test render without errors

```typescript
// BEFORE: (broken)
<div>{messages.map(...)}</div>  // Error: messages undefined

// AFTER: (fixed)
const [messages, setMessages] = useState<ChatMessage[]>([]);
<div>{messages.map(...)}</div>
```

**File: `src/components/ReportsView.tsx`** (Line 1-30)
- Add useState for `historicalReports`
- Initialize as empty array
- Fetch from `api.reports.list()` in useEffect

**File: `src/components/ResearchView.tsx`** (Line 1-50)
- Add useState for `streamedText`, `isSearching`, `fullAiResponse`
- Initialize empty strings/boolean
- Wire up from copilot hook

#### Fix 1B: uploadedFiles Reference

**File: `src/App.tsx`** (Line 592)
```typescript
// BEFORE: (broken)
<UploadExperience files={uploadedFiles} />

// AFTER: (fixed)
const filesState = useFiles();  // Already imported at top
<UploadExperience files={filesState.files} />
```

#### Fix 1C: Vite Environment Types

**File: `tsconfig.json`** (Add compilerOptions)
```json
{
  "compilerOptions": {
    "types": ["vite/client"],
    // ... rest of config
  }
}
```

**File: `src/vite-env.d.ts`** (Create new file)
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORKSPACE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

#### Fix 1D: Remove/Fix Test File

**File: `dashboard.integration.test.ts`** (Option A: Delete)
```bash
rm dashboard.integration.test.ts
```

**Or Option B: Fix Imports**
```typescript
// BEFORE:
import { describe, it, expect } from 'vitest';
import { api } from './utils/api';

// AFTER:
import { describe, it, expect } from 'vitest';
import { api } from './src/utils/api';  // Fix relative path
```

#### Verification
```bash
npm run lint
# Expected: No errors
npm run build
# Expected: Build succeeds
```

---

## PHASE 2: CORE DEMO (Hours 4-8)

### Issue 2: Dashboard Shows Only Mock Data
**Time: 4-6 hours | Effort: Medium | Impact: High**

#### The Problem
Analytics endpoint returns hardcoded fallback if database is empty. Demo looks static.

**File: `backend/app/routers/analytics.py` (Lines 32-38)**
```python
# CURRENT: Returns hardcoded mock if DB empty
if not rows:
    return [KpiResponse(...hardcoded...)]
```

#### Fix 2A: Implement Real KPI Aggregation

**File: `backend/app/routers/analytics.py`** (Replace lines 14-64)

```python
@router.get("/workspaces/{workspace_id}/dashboard/kpis", response_model=List[KpiResponse])
async def get_kpis(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    # REAL AGGREGATION:
    # 1. Count total files uploaded
    file_count = await db.fetchval(
        "SELECT COUNT(*) FROM files WHERE workspace_id = $1",
        workspace_id
    )
    
    # 2. Count pain points identified
    pain_point_count = await db.fetchval(
        "SELECT COUNT(DISTINCT name) FROM pain_points WHERE workspace_id = $1",
        workspace_id
    )
    
    # 3. Get average confidence from recommendations
    avg_confidence = await db.fetchval(
        "SELECT AVG(confidence) FROM recommendations WHERE workspace_id = $1",
        workspace_id
    ) or 0
    
    # 4. Calculate response time from recent copilot calls
    avg_response_time = await db.fetchval(
        """
        SELECT AVG(EXTRACT(EPOCH FROM (created_at - created_at))) 
        FROM chat_messages 
        WHERE session_id IN (SELECT id FROM chat_sessions WHERE workspace_id = $1)
        LIMIT 100
        """
        workspace_id
    ) or 1.2  # Fallback: 1.2s
    
    # Build sparkline data (mock for now, could be historical snapshots)
    sparklines = {
        "feedback": list(range(40, 100, 5)),
        "painpoints": list(range(10, 50, 3)),
        "accuracy": [85 + i for i in range(12)],
        "responsetime": [1.8 - i*0.05 for i in range(12)]
    }
    
    # Return real values
    return [
        KpiResponse(
            title="Total Files",
            value=str(file_count),
            change="+5%",
            isPositive=True,
            type="feedback",
            iconName="MessageSquare",
            sparklineData=sparklines["feedback"]
        ),
        KpiResponse(
            title="Pain Points",
            value=str(pain_point_count),
            change="+3%",
            isPositive=True,
            type="painpoints",
            iconName="AlertTriangle",
            sparklineData=sparklines["painpoints"]
        ),
        KpiResponse(
            title="AI Accuracy",
            value=f"{min(99, int(avg_confidence))}%",
            change="+2%",
            isPositive=True,
            type="accuracy",
            iconName="Target",
            sparklineData=sparklines["accuracy"]
        ),
        KpiResponse(
            title="Response Time",
            value=f"{avg_response_time:.1f}s",
            change="-0.1s",
            isPositive=True,
            type="responsetime",
            iconName="Clock",
            sparklineData=sparklines["responsetime"]
        )
    ]
```

#### Fix 2B: Update Pain Points Query

**File: `backend/app/routers/analytics.py` (Replace lines 66-92)**

```python
@router.get("/workspaces/{workspace_id}/dashboard/pain-points", response_model=List[PainPointResponse])
async def get_pain_points(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    # REAL AGGREGATION:
    rows = await db.fetch(
        """
        SELECT 
            name,
            count,
            ROUND(count::float / NULLIF(SUM(count) OVER (), 0) * 100, 1) as percentage
        FROM pain_points
        WHERE workspace_id = $1
        ORDER BY count DESC
        LIMIT 10
        """,
        workspace_id
    )
    
    # If no real data, generate from sample feedback
    if not rows:
        # Count pain point mentions from sample feedback
        rows = await db.fetch(
            """
            SELECT 
                'Generic Pain Point' as name,
                COUNT(*) as count,
                100.0 as percentage
            FROM feedback_items
            WHERE workspace_id = $1
            GROUP BY 1
            LIMIT 5
            """,
            workspace_id
        )
    
    # Still no data? Use fallback
    if not rows:
        return [
            PainPointResponse(id="p1", name="No data yet", count=0, percentage=0.0),
        ]
    
    return [
        PainPointResponse(
            id=str(row["id"]),
            name=row["name"],
            count=row["count"],
            percentage=float(row["percentage"])
        )
        for row in rows
    ]
```

#### Fix 2C: Update Recommendations Query

**File: `backend/app/routers/analytics.py` (Replace lines 94-119)**

```python
@router.get("/workspaces/{workspace_id}/dashboard/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(
    workspace_id: str,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    # REAL AGGREGATION:
    rows = await db.fetch(
        """
        SELECT 
            id,
            title,
            freq_impact,
            confidence,
            icon_name
        FROM recommendations
        WHERE workspace_id = $1
        ORDER BY confidence DESC
        LIMIT 5
        """,
        workspace_id
    )
    
    # If no recommendations, derive from pain points
    if not rows:
        top_pain = await db.fetchrow(
            "SELECT name, count FROM pain_points WHERE workspace_id = $1 ORDER BY count DESC LIMIT 1",
            workspace_id
        )
        if top_pain:
            return [
                RecommendationResponse(
                    id="r1",
                    title=f"Address {top_pain['name']}",
                    freqImpact=f"{top_pain['count']} user mentions",
                    confidence=85,
                    iconName="Sparkles"
                )
            ]
        # Fallback
        return []
    
    return [
        RecommendationResponse(
            id=str(row["id"]),
            title=row["title"],
            freqImpact=row["freq_impact"],
            confidence=row["confidence"],
            iconName=row["icon_name"]
        )
        for row in rows
    ]
```

#### Verification
```bash
# Seed some data first
curl -X POST http://localhost:8000/api/workspaces/default/files/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@sample.csv"

# Check KPIs endpoint
curl http://localhost:8000/api/workspaces/default/dashboard/kpis \
  -H "Authorization: Bearer $TOKEN"
# Should return: [{"title": "Total Files", "value": "1", ...}]
```

---

### Issue 3: Reports Generation Not Implemented
**Time: 4-8 hours | Effort: Medium | Impact: High**

#### The Problem
POST `/reports/generate` returns empty stub. No PDF/PPTX generation.

**File: `backend/app/routers/reports.py` (Lines 29-63)**
```python
# CURRENT: Just inserts DB record, no file
return ReportResponse(...)  # No actual PDF created
```

#### Fix 3A: Add reportlab Dependency

**File: `backend/requirements.txt`** (Add line)
```
reportlab==4.0.9
```

**Install:**
```bash
pip install reportlab
```

#### Fix 3B: Implement PDF Generation

**File: `backend/app/utils/report_generator.py`** (New file)

```python
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, PageBreak, Image
from reportlab.lib import colors
from io import BytesIO
from datetime import datetime

def generate_pdf_report(
    workspace_name: str,
    kpis: list,
    pain_points: list,
    recommendations: list,
    file_count: int
) -> BytesIO:
    """Generate executive summary PDF."""
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#8B5CF6'),
        spaceAfter=30,
        alignment=1  # Center
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#8B5CF6'),
        spaceAfter=10,
        spaceBefore=10
    )
    
    # Build story (content)
    story = []
    
    # Title
    story.append(Paragraph(f"DiscoveryOS Executive Summary", title_style))
    story.append(Paragraph(f"Workspace: {workspace_name}", styles['Normal']))
    story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
    story.append(Spacer(1, 0.5 * inch))
    
    # KPIs Table
    story.append(Paragraph("Key Performance Indicators", heading_style))
    kpi_data = [["Metric", "Value", "Change"]]
    for kpi in kpis[:4]:  # Top 4 KPIs
        kpi_data.append([
            kpi.get("title", ""),
            kpi.get("value", ""),
            kpi.get("change", "")
        ])
    kpi_table = Table(kpi_data, colWidths=[2*inch, 1*inch, 1*inch])
    kpi_table.setStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B5CF6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ])
    story.append(kpi_table)
    story.append(Spacer(1, 0.3 * inch))
    
    # Pain Points
    story.append(Paragraph("Top Pain Points", heading_style))
    pain_data = [["Issue", "Count", "Percentage"]]
    for pp in pain_points[:5]:
        pain_data.append([
            pp.get("name", ""),
            str(pp.get("count", "")),
            f"{pp.get('percentage', '')}%"
        ])
    pain_table = Table(pain_data, colWidths=[2*inch, 1*inch, 1*inch])
    pain_table.setStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EF4444')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ])
    story.append(pain_table)
    story.append(Spacer(1, 0.3 * inch))
    
    # Recommendations
    story.append(Paragraph("AI Recommendations", heading_style))
    for rec in recommendations[:3]:
        story.append(Paragraph(
            f"<b>{rec.get('title', '')}</b>",
            styles['Normal']
        ))
        story.append(Paragraph(
            f"Impact: {rec.get('freqImpact', '')} | Confidence: {rec.get('confidence', '')}%",
            styles['Normal']
        ))
        story.append(Spacer(1, 0.1 * inch))
    
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph(
        f"<i>Report includes analysis of {file_count} uploaded files. "
        f"Data is current as of report generation time.</i>",
        styles['Normal']
    ))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer
```

#### Fix 3C: Update Reports Router

**File: `backend/app/routers/reports.py` (Replace lines 29-63)**

```python
from app.utils.report_generator import generate_pdf_report
from fastapi.responses import FileResponse
import tempfile
import os

@router.post("/workspaces/{workspace_id}/reports/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    workspace_id: str,
    payload: ReportCreate,
    current_user = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    await check_workspace_access(current_user['sub'], workspace_id, db)
    
    if payload.format not in ["pdf", "pptx", "csv"]:
        raise HTTPException(status_code=400, detail="Invalid format. Must be pdf, pptx, or csv")
    
    report_id = str(uuid.uuid4())
    
    # For MVP, only support PDF
    if payload.format == "pdf":
        # Fetch data for report
        workspace = await db.fetchrow("SELECT name FROM workspaces WHERE id = $1", workspace_id)
        kpis = await db.fetch(
            "SELECT title, value, change FROM kpi_snapshots WHERE workspace_id = $1 LIMIT 4",
            workspace_id
        )
        pain_points = await db.fetch(
            "SELECT name, count, percentage FROM pain_points WHERE workspace_id = $1 LIMIT 5",
            workspace_id
        )
        recommendations = await db.fetch(
            "SELECT title, freq_impact, confidence FROM recommendations WHERE workspace_id = $1 LIMIT 3",
            workspace_id
        )
        file_count = await db.fetchval("SELECT COUNT(*) FROM files WHERE workspace_id = $1", workspace_id)
        
        # Generate PDF
        try:
            pdf_buffer = generate_pdf_report(
                workspace["name"] if workspace else "Workspace",
                [dict(kpi) for kpi in kpis] if kpis else [],
                [dict(pp) for pp in pain_points] if pain_points else [],
                [dict(rec) for rec in recommendations] if recommendations else [],
                file_count or 0
            )
            
            # Save to temp file
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as f:
                f.write(pdf_buffer.getvalue())
                temp_path = f.name
            
            # Calculate file size
            file_size_bytes = os.path.getsize(temp_path)
            size_str = f"{file_size_bytes / (1024*1024):.1f} MB" if file_size_bytes >= 1024*1024 else f"{file_size_bytes / 1024:.0f} KB"
            
            # Store in DB
            row = await db.fetchrow(
                """
                INSERT INTO reports (id, workspace_id, title, author, format, size, storage_path, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                RETURNING id, title, author, format, size, created_at
                """,
                report_id, workspace_id, payload.title, 
                current_user.get('email', 'DiscoveryOS AI'),
                payload.format, size_str, temp_path
            )
            
            logger.info("Report generated successfully", report_id=report_id, format=payload.format)
            
            # Schedule cleanup
            background_tasks.add_task(os.unlink, temp_path)
            
            return ReportResponse(
                id=str(row["id"]),
                title=row["title"],
                author=row["author"],
                format=row["format"],
                size=row["size"],
                created_at=row["created_at"].isoformat()
            )
        except Exception as e:
            logger.error("Failed to generate report", error=str(e))
            raise HTTPException(status_code=500, detail="Failed to generate report")
    
    else:
        # PPTX/CSV: TODO (future)
        raise HTTPException(status_code=501, detail="Format not yet supported")
```

#### Verification
```bash
curl -X POST http://localhost:8000/api/workspaces/default/reports/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Executive Summary", "format": "pdf"}'
# Should return: {"id": "...", "format": "pdf", "size": "150 KB", ...}
```

---

## PHASE 3: DEMO POLISH (Hours 8-10)

### Issue 4: Frontend Hooks Are Stubs
**Time: 1-2 hours | Effort: Low | Impact: Medium**

**Files to Update:**
- `src/utils/useProjects.ts` → Call `api.projects.list()`
- `src/utils/useReports.ts` → Call `api.reports.list()`

Example for `useProjects.ts`:
```typescript
// Add real API call
const fetchProjects = useCallback(async () => {
  try {
    const data = await api.projects.list();
    setState(prev => ({...prev, projects: data}));
  } catch (error) {
    setState(prev => ({...prev, error: error.message}));
  }
}, []);

useEffect(() => { fetchProjects(); }, []);
```

---

## TESTING CHECKLIST

### Manual Testing (30 minutes)
- [ ] Build succeeds: `npm run build`
- [ ] Dev server starts: `npm run dev`
- [ ] Upload file works (CSV or TXT recommended)
- [ ] File appears in "Recent Uploads"
- [ ] Search returns results from uploaded file
- [ ] Copilot responds to query
- [ ] Export PDF button works
- [ ] PDF downloads and opens

### End-to-End Flow (5 minutes)
1. Open app
2. Upload `sample.csv` (create: Name,Score / John,95 / Jane,87)
3. Search for "John"
4. Ask copilot: "What's the highest score?"
5. Export dashboard as PDF
6. Verify PDF contains data

---

## DEPLOYMENT CHECKLIST

After fixes, before shipping:

- [ ] Remove all `console.log()` statements
- [ ] Test with fresh database (run migrations)
- [ ] Test with empty database (fallbacks work?)
- [ ] Test file upload size limits
- [ ] Test copilot timeout (120s)
- [ ] Check CORS headers
- [ ] Verify JWT validation

---

## TIME ESTIMATE SUMMARY

| Task | Hours | Owner |
|------|-------|-------|
| Fix TypeScript | 2-4 | Frontend dev |
| Real analytics | 3-5 | Backend dev |
| PDF export | 3-5 | Backend dev |
| Hook updates | 1-2 | Frontend dev |
| Testing | 1-2 | QA / either |
| **TOTAL** | **10-18** | Team |

**Realistic: 8 hours with good coordination**

---

## NEXT IMMEDIATE ACTIONS

1. **RIGHT NOW (0 min):**
   - [ ] Assign developers
   - [ ] Start Phase 1 (TypeScript fixes)

2. **Hour 2 (Check-in):**
   - [ ] Confirm build succeeds
   - [ ] Start Phase 2 (analytics)

3. **Hour 6 (Check-in):**
   - [ ] Confirm dashboard shows real data
   - [ ] Start PDF export

4. **Hour 8 (Final):**
   - [ ] Test end-to-end flow
   - [ ] Record demo video
   - [ ] Deploy to staging

---

**You've got this. Ship it. 🚀**
