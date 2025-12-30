#!/usr/bin/env python3
"""
Helper script to add pages to pages.json
Usage: python3 add_page.py <page_id> <title> <content_file> <tags>
"""

import json
import sys
import os
from datetime import datetime

def add_page(json_file, page_id, title, content, tags, category=None):
    """Add a new page to pages.json"""

    # Read existing JSON
    with open(json_file, 'r') as f:
        data = json.load(f)

    # Create new page entry
    new_page = {
        "id": page_id,
        "title": title,
        "category": category.split('/') if category else None,
        "content": content,
        "related": [],  # Can be populated later
        "tags": tags if isinstance(tags, list) else tags.split(','),
        "lastModified": datetime.now().isoformat()
    }

    # Add to pages
    data['pages'][page_id] = new_page
    data['meta']['lastUpdated'] = datetime.now().isoformat()

    # Write back
    with open(json_file, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"Added page: {page_id}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python3 add_page.py <page_id> <title> <content_file> <tags>")
        sys.exit(1)

    page_id = sys.argv[1]
    title = sys.argv[2]
    content_file = sys.argv[3]
    tags = sys.argv[4].split(',')

    # Read content from file
    with open(content_file, 'r') as f:
        content = f.read()

    # Get absolute path to pages.json
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file = os.path.join(script_dir, 'data/pages.json')

    add_page(json_file, page_id, title, content, tags)
