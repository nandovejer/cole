"""Synthesizes phrases with Piper (open-source TTS) and saves them as mp3.

Gets a JSON list of {lang, text, out}. Called from scripts/audio.mjs.
Downloads the voices into .cache/piper the first time.
"""
import io
import json
import subprocess
import sys
import wave
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "piper"

# Spain Spanish and England English, female voices (Lola).
VOICES = {
    "es": {"model": "es_ES-sharvard-medium", "speaker": "F", "length_scale": 1.12},
    "en": {"model": "en_GB-cori-high", "speaker": None, "length_scale": 1.08},
}


def load(lang):
    cfg = VOICES[lang]
    onnx = CACHE / f"{cfg['model']}.onnx"
    if not onnx.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [sys.executable, "-m", "piper.download_voices", "--data-dir", str(CACHE), cfg["model"]],
            check=True,
        )
    voice = PiperVoice.load(str(onnx))
    speaker = None
    if cfg["speaker"] is not None:
        speaker = voice.config.speaker_id_map[cfg["speaker"]]
    return voice, SynthesisConfig(speaker_id=speaker, length_scale=cfg["length_scale"])


def to_mp3(wav_bytes, out):
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-loglevel", "error", "-y", "-i", "pipe:0",
            # trims the silence at the start and end so the pieces join well
            "-af", "silenceremove=start_periods=1:start_threshold=-50dB,"
                   "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,"
                   "apad=pad_dur=0.12",
            "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "48k", str(out),
        ],
        input=wav_bytes,
        check=True,
    )


def main():
    items = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    voices = {}
    for i, item in enumerate(items, 1):
        lang = item["lang"]
        if lang not in voices:
            voices[lang] = load(lang)
        voice, syn = voices[lang]
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wav:
            voice.synthesize_wav(item["text"], wav, syn_config=syn)
        to_mp3(buf.getvalue(), Path(item["out"]))
        if i % 50 == 0 or i == len(items):
            print(f"  {i}/{len(items)}", flush=True)


if __name__ == "__main__":
    main()
