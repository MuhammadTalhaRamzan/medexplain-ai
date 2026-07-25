"""
EasyOCR Python script invoked by the Node.js backend via child_process.

Reads an image file path from command-line arguments, runs EasyOCR,
and outputs the extracted text as JSON to stdout.

Usage:
    python ocr_script.py <image_path> [--languages en]
"""

import sys
import json
import argparse

def main():
    parser = argparse.ArgumentParser(description='Extract text from image using EasyOCR')
    parser.add_argument('image_path', type=str, help='Path to the image file')
    parser.add_argument('--languages', type=str, default='en', help='Comma-separated language codes')
    
    args = parser.parse_args()
    
    try:
        import easyocr
        
        languages = [lang.strip() for lang in args.languages.split(',')]
        
        # Initialize the reader (this loads the model on first run)
        reader = easyocr.Reader(languages, gpu=False)
        
        # Read text from the image
        results = reader.readtext(args.image_path)
        
        # Extract just the text and confidence
        extracted = []
        for bbox, text, confidence in results:
            extracted.append({
                'text': text,
                'confidence': round(confidence, 4),
                'bbox': [[int(coord) for coord in point] for point in bbox]
            })
        
        # Combine all text
        full_text = ' '.join([item['text'] for item in extracted])
        
        output = {
            'success': True,
            'text': full_text,
            'items': extracted,
            'word_count': len(extracted)
        }
        
        print(json.dumps(output))
        
    except ImportError as e:
        print(json.dumps({
            'success': False,
            'error': f'EasyOCR not installed: {str(e)}'
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()