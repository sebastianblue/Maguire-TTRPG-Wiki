#!/usr/bin/env python3
"""
Batch add spells from a formatted text file
Format:
SPELL: Spell Name
PAGE_ID: page/id/here
TAGS: tag1,tag2,tag3
---
<html content here>
---
"""

import sys
import subprocess

def parse_spell_file(filename):
    """Parse spell batch file into individual spells"""
    with open(filename, 'r') as f:
        content = f.read()

    spells = []
    spell_blocks = content.split('---\n')

    i = 0
    while i < len(spell_blocks):
        if i + 1 >= len(spell_blocks):
            break

        header = spell_blocks[i].strip()
        if not header:
            i += 1
            continue

        html_content = spell_blocks[i + 1].strip()

        # Parse header
        lines = header.split('\n')
        spell_data = {}
        for line in lines:
            if ': ' in line:
                key, value = line.split(': ', 1)
                spell_data[key] = value

        if 'SPELL' in spell_data and 'PAGE_ID' in spell_data:
            spells.append({
                'name': spell_data['SPELL'],
                'page_id': spell_data['PAGE_ID'],
                'tags': spell_data.get('TAGS', 'spell'),
                'content': html_content,
                'category': '/'.join(spell_data['PAGE_ID'].split('/')[:-1])
            })

        i += 2

    return spells

def add_spell(spell):
    """Add a single spell using add_page.py"""
    # Write content to temp file
    temp_file = f'/tmp/spell_{spell["page_id"].replace("/", "_")}.txt'
    with open(temp_file, 'w') as f:
        f.write(spell['content'])

    # Call add_page.py
    cmd = [
        'python3',
        '/Users/sebastianhochman/Downloads/Maguire-TTRPG-Wiki/add_page.py',
        spell['page_id'],
        spell['name'],
        temp_file,
        spell['tags'],
        spell['category']
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    print(f"Added: {spell['name']} ({spell['page_id']})")
    if result.returncode != 0:
        print(f"  Error: {result.stderr}")

    # Clean up temp file
    subprocess.run(['rm', temp_file])

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 add_spells_batch.py <spell_file>")
        sys.exit(1)

    spell_file = sys.argv[1]
    spells = parse_spell_file(spell_file)

    print(f"Found {len(spells)} spells to add")
    for spell in spells:
        add_spell(spell)

    print(f"\nSuccessfully added {len(spells)} spells!")

if __name__ == '__main__':
    main()
