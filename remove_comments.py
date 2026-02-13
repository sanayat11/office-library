import os
import re

def remove_comments(text, ext):
    if ext in ['.js', '.ts', '.tsx', '.css', '.scss']:
        # Remove single line comments
        text = re.sub(r'//.*', '', text)
        # Remove multi-line comments
        text = re.sub(r'/\*[\s\S]*?\*/', '', text)
    return text

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.ts', '.tsx', '.css', '.scss')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                ext = os.path.splitext(file)[1]
                new_content = remove_comments(content, ext)
                
                # Simple cleanup of empty lines that might have been left behind
                # new_content = re.sub(r'\n\s*\n', '\n', new_content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Cleaned: {filepath}")

if __name__ == "__main__":
    try:
        process_directory('src')
    except Exception as e:
        print(f"Error occurred: {e}")
        import traceback
        traceback.print_exc()
