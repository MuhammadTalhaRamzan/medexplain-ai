"""
EasyOCR Python script invoked by the Node.js backend via child_process.

Reads an image file path from command-line arguments, runs EasyOCR,
and outputs the extracted text as JSON to stdout.

Usage:
    python ocr_script.py <image_path> [--languages en]
"""

import sys
import os
import json
import argparse
import traceback
from datetime import datetime, timezone

DEBUG_LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ocr_debug.log')


def log_debug(message):
    """Always-on debug log, independent of stdout capture — so a crash
    that somehow loses stdout still leaves a trace on disk."""
    try:
        with open(DEBUG_LOG_PATH, 'a', encoding='utf-8') as f:
            f.write(f'[{datetime.now(timezone.utc).isoformat()}] {message}\n')
    except Exception:
        pass  # never let logging itself crash the script


def emit(payload):
    """Print JSON and flush immediately — do not rely on interpreter
    shutdown to flush buffered output, since an external kill (SIGTERM,
    antivirus termination, etc.) can lose anything not yet flushed."""
    print(json.dumps(payload))
    sys.stdout.flush()


def main():
    parser = argparse.ArgumentParser(description='Extract text from image using EasyOCR')
    parser.add_argument('image_path', type=str, help='Path to the image file')
    parser.add_argument('--languages', type=str, default='en', help='Comma-separated language codes')

    args = parser.parse_args()
    log_debug(f'Starting OCR: image={args.image_path} languages={args.languages}')

    try:
        import easyocr

        languages = [lang.strip() for lang in args.languages.split(',')]

        log_debug('Initializing easyocr.Reader (this triggers model download on first run)')
        reader = easyocr.Reader(languages, gpu=False)
        log_debug('Reader initialized successfully')

        results = reader.readtext(args.image_path)
        log_debug(f'readtext() returned {len(results)} items')

        extracted = []
        for bbox, text, confidence in results:
            extracted.append({
                'text': text,
                'confidence': round(confidence, 4),
                'bbox': [[int(coord) for coord in point] for point in bbox]
            })

        full_text = ' '.join([item['text'] for item in extracted])

        emit({
            'success': True,
            'text': full_text,
            'items': extracted,
            'word_count': len(extracted)
        })

    except ImportError as e:
        log_debug(f'ImportError: {e}\n{traceback.format_exc()}')
        emit({
            'success': False,
            'error': f'EasyOCR not installed: {str(e)}'
        })
        sys.exit(1)
    except Exception as e:
        tb = traceback.format_exc()
        log_debug(f'Exception: {e!r}\n{tb}')
        message = str(e).strip() or f'{type(e).__name__} (see ocr_debug.log for full traceback)'
        emit({
            'success': False,
            'error': message
        })
        sys.exit(1)


if __name__ == '__main__':
    try:
        main()
    except BaseException as e:
        log_debug(f'Fatal (outside main try/except): {e!r}\n{traceback.format_exc()}')
        raise