# core/keyword_detector.py
import re

def detectar_keywords(transcripcion: str, keywords: list[str]) -> list[str]:
    """
    Compara la transcripción contra la lista de keywords.
    Retorna lista de keywords encontradas (puede ser más de una).
    La comparación ignora mayúsculas/minúsculas y acentos básicos.
    """
    texto = transcripcion.lower()
    encontradas = []

    for kw in keywords:
        patron = re.escape(kw.lower())
        if re.search(patron, texto):
            encontradas.append(kw)

    return encontradas