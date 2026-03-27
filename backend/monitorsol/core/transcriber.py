# core/transcriber.py
import whisper
from config import MODELO_WHISPER

_modelo = None

def get_modelo():
    """Carga el modelo una sola vez y lo reutiliza (singleton)."""
    global _modelo
    if _modelo is None:
        print(f"[transcriber] Cargando modelo Whisper '{MODELO_WHISPER}'...")
        _modelo = whisper.load_model(MODELO_WHISPER)
        print(f"[transcriber] Modelo listo.")
    return _modelo

def transcribir(audio_path: str, keywords: list[str]) -> str:
    """
    Transcribe un archivo WAV.
    Usa initial_prompt con las keywords para que Whisper
    les preste más atención.
    """
    modelo = get_modelo()
    prompt = "Escucha atentamente: " + ", ".join(keywords) if keywords else ""

    resultado = modelo.transcribe(
        audio_path,
        language="es",
        initial_prompt=prompt,
        fp16=False        # fp16=False es más estable en Mac ARM
    )
    return resultado["text"].strip()