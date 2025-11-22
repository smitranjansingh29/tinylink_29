CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    last_clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at);