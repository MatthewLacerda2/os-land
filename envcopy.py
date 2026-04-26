import shutil
import os

def copy_env():
    # Root .env file
    src = '.env'
    
    # Destination paths
    destinations = [
        os.path.join('backend', '.env'),
        os.path.join('frontend', '.env')
    ]
    
    if not os.path.exists(src):
        print(f"Error: Source file '{src}' not found in the root directory.")
        return

    for dest in destinations:
        try:
            # Ensure the directory exists before copying
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            
            shutil.copy2(src, dest)
            print(f"Successfully copied .env to: {dest}")
        except Exception as e:
            print(f"Error copying to {dest}: {e}")

if __name__ == "__main__":
    copy_env()