# ---- Stage 1: build the frontend ----
FROM node:20-alpine AS frontend-build

# These get baked into the compiled JS at build time (Vite requirement) —
# set them as Build Arguments in your hosting platform.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

WORKDIR /app/frontend-ui
COPY frontend-ui/package*.json ./
RUN npm install
COPY frontend-ui/ ./
RUN npm run build

# ---- Stage 2: the actual app (FastAPI serves the API + the built frontend) ----
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ backend/
COPY database/ database/
COPY ai_ml/ ai_ml/
COPY --from=frontend-build /app/frontend-ui/dist frontend-ui/dist

# Render/Railway/Fly all inject $PORT at runtime — fall back to 8000 locally.
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
