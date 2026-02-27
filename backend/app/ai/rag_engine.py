"""
RAG (Retrieval-Augmented Generation) Engine for MedAI.

HOW IT WORKS:
1. At startup, read all .txt files in medical_knowledge/
2. Split each file into overlapping chunks of ~400 characters
3. Convert each chunk to a 384-dimensional vector using sentence-transformers
4. Store all vectors + text in ChromaDB (persistent on disk)

At query time:
1. Convert the user's question to a vector
2. Find the 5 most similar vectors in ChromaDB (cosine similarity search)
3. Return the text of those 5 chunks
4. These chunks become Meditron's context — it answers based on them
"""
import os
import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

# Paths
KNOWLEDGE_DIR = "medical_knowledge"
CHROMA_DIR    = "chroma_db"
COLLECTION    = "medai_knowledge"
CHUNK_SIZE    = 400
OVERLAP       = 80

# Load embedding model once at module level (cached after first load)
_embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# ChromaDB client (persistent on disk)
_chroma = chromadb.PersistentClient(
    path=CHROMA_DIR,
    settings=ChromaSettings(anonymized_telemetry=False)
)


def _get_collection():
    return _chroma.get_or_create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"}
    )


def _chunk_text(text: str) -> list[str]:
    """Split text into overlapping chunks."""
    chunks, start = [], 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += CHUNK_SIZE - OVERLAP
    return chunks


def build_index():
    """Build or rebuild the medical knowledge vector index."""
    collection = _get_collection()
    
    all_texts, all_ids, all_metas = [], [], []
    idx = 0

    for fname in sorted(os.listdir(KNOWLEDGE_DIR)):
        if not fname.endswith(".txt"):
            continue
        
        fpath = os.path.join(KNOWLEDGE_DIR, fname)
        text  = open(fpath, "r", encoding="utf-8").read()
        chunks = _chunk_text(text)
        disease = fname.replace(".txt", "").replace("_", " ").title()

        for chunk in chunks:
            all_texts.append(chunk)
            all_ids.append(f"chunk_{idx}")
            all_metas.append({"source": disease, "file": fname, "idx": idx})
            idx += 1

        print(f"  📄 {fname}: {len(chunks)} chunks")

    if not all_texts:
        print("⚠️  No .txt files found in medical_knowledge/")
        return 0

    # Delete existing and re-add (clean re-index)
    try:
        _chroma.delete_collection(COLLECTION)
    except Exception:
        pass
    
    collection = _chroma.get_or_create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"}
    )

    print(f"🔢 Embedding {len(all_texts)} chunks...")
    embeddings = _embedder.encode(all_texts).tolist()

    # Add in batches of 100 (ChromaDB limit per call)
    batch_size = 100
    for i in range(0, len(all_texts), batch_size):
        collection.add(
            documents=all_texts[i:i+batch_size],
            embeddings=embeddings[i:i+batch_size],
            ids=all_ids[i:i+batch_size],
            metadatas=all_metas[i:i+batch_size]
        )

    total = collection.count()
    print(f"✅ RAG index built: {total} chunks ready")
    return total


def retrieve(query: str, n: int = 5) -> list[dict]:
    """
    Semantic search — find medical knowledge most relevant to a query.
    """
    collection = _get_collection()
    count = collection.count()
    
    if count == 0:
        print("⚠️  Knowledge base is empty — run build_index() first")
        return []

    q_embedding = _embedder.encode(query).tolist()
    
    results = collection.query(
        query_embeddings=[q_embedding],
        n_results=min(n, count),
        include=["documents", "metadatas", "distances"]
    )

    chunks = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        # cosine distance: 0=identical, 1=opposite. Keep only relevant ones.
        if dist < 0.8:
            chunks.append({
                "text": doc,
                "source": meta.get("source", "General"),
                "relevance": round(1 - dist, 3)
            })

    return sorted(chunks, key=lambda x: x["relevance"], reverse=True)
