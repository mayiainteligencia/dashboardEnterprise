# core/stream_capture.py
import asyncio
import os
import tempfile
from config import CHUNK_SEGUNDOS

async def capturar_chunk(url: str, sesion_id: str, chunk_index: int) -> str | None:
    """
    Captura CHUNK_SEGUNDOS de audio desde una URL de stream
    y lo guarda como archivo WAV temporal.
    Retorna la ruta del archivo o None si falló.
    """
    tmp_dir = tempfile.gettempdir()
    output_path = os.path.join(tmp_dir, f"chunk_{sesion_id}_{chunk_index}.wav")

    cmd = [
        "ffmpeg",
        "-y",                        # sobreescribir si existe
        "-i", url,                   # URL del stream
        "-t", str(CHUNK_SEGUNDOS),   # duración del chunk
        "-ar", "16000",              # sample rate que Whisper necesita
        "-ac", "1",                  # mono
        "-f", "wav",                 # formato WAV
        output_path,
        "-loglevel", "error"         # silenciar output de ffmpeg
    ]

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        _, stderr = await asyncio.wait_for(proc.communicate(), timeout=CHUNK_SEGUNDOS + 10)

        if proc.returncode != 0:
            print(f"[stream_capture] Error ffmpeg sesion {sesion_id}: {stderr.decode()}")
            return None

        if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
            return None

        return output_path

    except asyncio.TimeoutError:
        print(f"[stream_capture] Timeout capturando chunk {chunk_index} sesion {sesion_id}")
        proc.kill()
        return None
    except Exception as e:
        print(f"[stream_capture] Excepción: {e}")
        return None

def limpiar_chunk(path: str):
    """Elimina el archivo WAV temporal después de transcribirlo."""
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception:
        pass