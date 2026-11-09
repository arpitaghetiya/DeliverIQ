"""
DeliverIQ FastAPI backend.
Wraps the existing ML model and provides dual-database support:
- PostgreSQL (Neon.tech / Supabase / production) when DATABASE_URL is configured
- SQLite (local deliveriq.db) when DATABASE_URL is unset

Run: uvicorn api:app --reload --port 8000
"""
import json
import os
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False

# ── Import existing ML code (unchanged) ───────────────────────────────────────
from predict import predict_delivery_time

BASE = Path(__file__).parent
DB_PATH = BASE / "deliveriq.db"

app = FastAPI(title="DeliverIQ API", version="1.2.0")

# ── CORS Configuration (Strictly Escaped) ─────────────────────────────────────
ALLOWED_ORIGIN_REGEX = (
    r"^https?://("
    r"localhost|127\.0\.0\.1|"
    r"(?:[a-zA-Z0-9-]+\.)*vercel\.app|"
    r"(?:[a-zA-Z0-9-]+\.)*hf\.space|"
    r"(?:[a-zA-Z0-9-]+\.)*onrender\.com|"
    r"(?:[a-zA-Z0-9-]+\.)*trycloudflare\.com"
    r")(:\d+)?$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Dual Database Abstraction Layer (SQLite & PostgreSQL) ─────────────────────
class DBWrapper:
    """Wrapper that normalizes parameter placeholders, transactions, and row access across SQLite & PostgreSQL."""
    def __init__(self, conn, is_pg: bool = False):
        self.conn = conn
        self.is_pg = is_pg
        self.cur = None

    def execute(self, sql: str, params: tuple = ()):
        if self.is_pg:
            pg_sql = sql.replace("?", "%s")
            self.cur = self.conn.cursor(cursor_factory=RealDictCursor)
            self.cur.execute(pg_sql, params)
            return self.cur
        else:
            self.cur = self.conn.execute(sql, params)
            return self.cur

    def commit(self):
        self.conn.commit()

    def rollback(self):
        try:
            self.conn.rollback()
        except Exception:
            pass

    def close(self):
        try:
            if self.cur and hasattr(self.cur, "close"):
                self.cur.close()
        except Exception:
            pass
        try:
            self.conn.close()
        except Exception:
            pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.rollback()
        self.close()

def get_db() -> DBWrapper:
    db_url = os.getenv("DATABASE_URL", "").strip()
    if db_url and (db_url.startswith("postgres://") or db_url.startswith("postgresql://")):
        if not PSYCOPG2_AVAILABLE:
            raise RuntimeError("psycopg2-binary is required when DATABASE_URL is configured.")
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        conn = psycopg2.connect(db_url)
        return DBWrapper(conn, is_pg=True)
    else:
        conn = sqlite3.connect(str(DB_PATH))
        conn.row_factory = sqlite3.Row
        return DBWrapper(conn, is_pg=False)

def init_db():
    conn = None
    try:
        conn = get_db()
        conn.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                customer_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                address TEXT NOT NULL,
                city_type TEXT DEFAULT 'Urban',
                restaurant_id INTEGER NOT NULL,
                restaurant_name TEXT NOT NULL,
                items TEXT NOT NULL,
                subtotal REAL NOT NULL,
                delivery_fee REAL NOT NULL,
                discount REAL DEFAULT 0,
                tax REAL NOT NULL,
                total REAL NOT NULL,
                payment_method TEXT NOT NULL,
                coupon_code TEXT,
                status TEXT DEFAULT 'confirmed',
                predicted_time REAL,
                distance_km REAL DEFAULT 5.0,
                weather TEXT DEFAULT 'Sunny',
                traffic TEXT DEFAULT 'Medium',
                created_at TEXT NOT NULL
            )
        """)
        conn.commit()
    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[DeliverIQ DB Init Notice] {exc}")
    finally:
        if conn:
            conn.close()

init_db()

# ── Pydantic schemas ───────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    distance_km: float = 5.0
    prep_time_min: float = 10.0
    weather: str = "Sunny"
    traffic: str = "Medium"
    city_type: str = "Urban"
    vehicle: str = "motorcycle"
    festival: str = "No"
    order_type: str = "Meal"
    pickup_hour: int = 19
    day_of_week: int = 4
    is_weekend: int = 0

class OrderItem(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

class PlaceOrderRequest(BaseModel):
    customer_name: str
    phone: str
    address: str
    city_type: str = "Urban"
    restaurant_id: int
    restaurant_name: str
    items: list[OrderItem]
    subtotal: float
    delivery_fee: float
    discount: float = 0.0
    tax: float
    total: float
    payment_method: str
    coupon_code: Optional[str] = None
    predicted_time: Optional[float] = None
    distance_km: float = 5.0
    weather: str = "Sunny"
    traffic: str = "Medium"

class UpdateStatusRequest(BaseModel):
    status: str

# ── ML Prediction endpoint ─────────────────────────────────────────────────────
@app.post("/api/predict")
def predict(req: PredictRequest):
    """Call the existing Random Forest model for delivery time prediction."""
    try:
        inputs = {
            "Delivery_person_Age": 29,
            "Delivery_person_Ratings": 4.5,
            "distance_km": req.distance_km,
            "Vehicle_condition": 1,
            "multiple_deliveries": 0,
            "prep_time_min": req.prep_time_min,
            "pickup_hour": req.pickup_hour,
            "day_of_week": req.day_of_week,
            "is_weekend": req.is_weekend,
            "Weather_conditions": req.weather,
            "Road_traffic_density": req.traffic,
            "Type_of_order": req.order_type,
            "Type_of_vehicle": req.vehicle,
            "Festival": req.festival,
            "City": req.city_type,
        }
        minutes = predict_delivery_time(inputs)
        minutes = max(10.0, min(120.0, round(minutes, 1)))
        return {
            "predicted_minutes": minutes,
            "model": "Random Forest",
            "inputs_used": inputs,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Model error: {str(exc)}")

# ── Order endpoints ────────────────────────────────────────────────────────────
@app.post("/api/orders")
def place_order(req: PlaceOrderRequest):
    order_id = str(uuid.uuid4())[:8].upper()
    now = datetime.now().isoformat()
    items_json = json.dumps([i.model_dump() for i in req.items])
    conn = get_db()
    try:
        conn.execute("""
            INSERT INTO orders (
                id, customer_name, phone, address, city_type,
                restaurant_id, restaurant_name, items,
                subtotal, delivery_fee, discount, tax, total,
                payment_method, coupon_code, status,
                predicted_time, distance_km, weather, traffic, created_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            order_id, req.customer_name, req.phone, req.address, req.city_type,
            req.restaurant_id, req.restaurant_name, items_json,
            req.subtotal, req.delivery_fee, req.discount, req.tax, req.total,
            req.payment_method, req.coupon_code, "confirmed",
            req.predicted_time, req.distance_km, req.weather, req.traffic, now
        ))
        conn.commit()
        return {"order_id": order_id, "status": "confirmed", "created_at": now}
    except Exception as exc:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(exc)}")
    finally:
        conn.close()

@app.get("/api/orders")
def list_orders():
    conn = get_db()
    try:
        cur = conn.execute("SELECT * FROM orders ORDER BY created_at DESC")
        rows = cur.fetchall()
        orders = []
        for r in rows:
            o = dict(r)
            if isinstance(o.get("items"), str):
                o["items"] = json.loads(o["items"])
            orders.append(o)
        return orders
    finally:
        conn.close()

@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    conn = get_db()
    try:
        cur = conn.execute("SELECT * FROM orders WHERE id=?", (order_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Order not found")
        o = dict(row)
        if isinstance(o.get("items"), str):
            o["items"] = json.loads(o["items"])
        return o
    finally:
        conn.close()

@app.patch("/api/orders/{order_id}/status")
def update_status(order_id: str, body: UpdateStatusRequest):
    valid = ["confirmed", "preparing", "picked_up", "on_the_way", "delivered"]
    if body.status not in valid:
        raise HTTPException(status_code=400, detail="Invalid status")
    conn = get_db()
    try:
        cur = conn.execute(
            "UPDATE orders SET status=? WHERE id=?", (body.status, order_id)
        )
        conn.commit()
        rowcount = cur.rowcount
        if rowcount == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        return {"order_id": order_id, "status": body.status}
    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(exc)}")
    finally:
        conn.close()

# ── Admin analytics ────────────────────────────────────────────────────────────
@app.get("/api/admin/stats")
def admin_stats():
    conn = get_db()
    try:
        cur = conn.execute("SELECT * FROM orders")
        rows = cur.fetchall()
        orders = [dict(r) for r in rows]
        total_revenue = sum(float(o["total"]) for o in orders)
        status_counts = {}
        for o in orders:
            st = o.get("status", "confirmed")
            status_counts[st] = status_counts.get(st, 0) + 1
        restaurant_counts = {}
        for o in orders:
            rn = o.get("restaurant_name", "Unknown")
            restaurant_counts[rn] = restaurant_counts.get(rn, 0) + 1

        db_type = "postgresql" if (os.getenv("DATABASE_URL", "").startswith("postgres")) else "sqlite"
        return {
            "total_orders": len(orders),
            "total_revenue": round(total_revenue, 2),
            "status_counts": status_counts,
            "restaurant_counts": restaurant_counts,
            "avg_order_value": round(total_revenue / len(orders), 2) if orders else 0,
            "database": db_type,
        }
    finally:
        conn.close()

@app.get("/api/health")
def health():
    db_type = "postgresql" if (os.getenv("DATABASE_URL", "").startswith("postgres")) else "sqlite"
    return {"status": "ok", "service": "DeliverIQ API", "database": db_type}
