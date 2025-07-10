CREATE INDEX "l2_index" ON "audio_chunks" USING hnsw ("embeddings" vector_l2_ops);
CREATE INDEX "ip_index" ON "audio_chunks" USING hnsw ("embeddings" vector_ip_ops);