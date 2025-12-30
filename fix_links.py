#!/usr/bin/env python3
"""
Fix all markdown-style links [Text](/path) to proper onclick format:
<a href="#" onclick="Tabs.openTab('page-id', 'Page Title'); return false;">Text</a>
"""

import json
import re
from datetime import datetime

def extract_title_from_url(url):
    """Extract a reasonable title from a URL path"""
    # Remove leading slash
    url = url.lstrip('/')

    # Get the last part of the path
    parts = url.split('/')
    title = parts[-1]

    # Convert dashes and underscores to spaces
    title = title.replace('-', ' ').replace('_', ' ')

    # Capitalize words
    title = ' '.join(word.capitalize() for word in title.split())

    # Special cases
    title_map = {
        'the-adept': 'The Adept',
        'the-unionist': 'The Unionist',
        'the-lurlinite': 'The Lurlinite',
        'the-witch': 'The Witch',
        'the-agent': 'The Agent',
        'the-scholar': 'The Scholar',
        'the-soldier': 'The Soldier',
        'the-artisan': 'The Artisan',
        'the-traveler': 'The Traveler',
        'the-performer': 'The Performer',
        'the-grimmerie': 'The Grimmerie',
        'the-wizard': 'The Wizard of Oz',
        'the-gump': 'The Gump',
        'the-vinkus': 'The Vinkus',
        'the-clock': 'The Clock of the Time Dragon',
        'the-touched': 'The Touched',
        'dr-dillamond': 'Dr. Dillamond',
        'shiz-university': 'Shiz University',
        'emerald-city': 'The Emerald City',
        'emerald-city-native': 'Emerald City Native',
        'gillikin': 'Gillikin',
        'munchkinland': 'Munchkinland',
        'quadling-country': 'Quadling Country',
        'elphaba-thropp': 'Elphaba Thropp',
        'nessarose-thropp': 'Nessarose Thropp',
        'princess-ozma': 'Princess Ozma',
        'princess-nastoya': 'Princess Nastoya',
        'dorothy-gale': 'Dorothy Gale',
        'fiyero-tigelaar': 'Fiyero Tigelaar',
        'conference-of-birds': 'The Conference of the Birds',
        'animal-resistance': 'The Animal Resistance',
        'animal-underground-railroad': 'Animal Underground Railroad',
        'the-gale-force': 'The Gale Force',
        'gale-force': 'The Gale Force',
        'free-munchkinland-movement': 'Free Munchkinland Movement',
        'deadly-desert': 'The Deadly Desert',
        'kiamo-ko': 'Kiamo Ko',
        'colwen-grounds': 'Colwen Grounds',
        'southstairs': 'Southstairs',
        'unionism': 'Unionism',
        'unionist-god': 'The Unnamed God',
        'lurlinite-faith': 'Lurlinite Faith',
        'lurline': 'Lurline',
        'domingon-trance': 'Domingon Trance',
        'animal-etiquette': 'Animal Etiquette',
        'grimmerie-lore': 'Grimmerie Lore',
        'time-sense': 'Time Sense',
        'kumbric-memory': 'Kumbric Memory',
        'dragon-lore': 'Dragon Lore',
        'green-sight': 'Green Sight',
        'political-navigation': 'Political Navigation',
        'tiktok-maintenance': 'Tiktok Maintenance',
        'animal-passing': 'Animal Passing as animal',
        'former-animal': 'Former Animal',
        'silenced': 'Silenced',
        'grimmerie-corrupted': 'Grimmerie-Corrupted',
        'puppet-state': 'Puppet-State',
        'ruby-slippers': 'The Ruby Slippers',
        'golden-cap': 'The Golden Cap',
        'silver-slippers': 'Silver Slippers',
        'witch-broom': 'Witch\'s Broom',
        'wizards-balloon': 'The Wizard\'s Balloon',
        'quadling-genocide': 'The Quadling Genocide',
        'time-dragon': 'The Time Dragon',
        'lesser-dragon': 'Lesser Dragon',
        'kalidah': 'Kalidah',
    }

    # Check if we have a specific mapping
    base_name = parts[-1]
    if base_name in title_map:
        return title_map[base_name]

    return title

def html_link_to_onclick(match):
    """Convert an HTML link to onclick format"""
    url = match.group(1)
    text = match.group(2)

    # Remove leading slash from URL to get page ID
    page_id = url.lstrip('/')

    # Get title from URL
    title = extract_title_from_url(url)

    # Build the onclick link
    return f'<a href="#" onclick="Tabs.openTab(\'{page_id}\', \'{title}\'); return false;">{text}</a>'

def fix_page_content(content):
    """Fix all HTML href links in page content"""
    # Pattern to match HTML links: <a href="/path">text</a>
    # This captures the href path and the link text
    pattern = r'<a href="(/[^"]+)">([^<]+)</a>'

    fixed_content = re.sub(pattern, html_link_to_onclick, content)

    return fixed_content

def main():
    json_file = '/Users/sebastianhochman/Downloads/Maguire-TTRPG-Wiki/oz-wiki/data/pages.json'

    # Read the JSON
    print("Reading pages.json...")
    with open(json_file, 'r') as f:
        data = json.load(f)

    # Track changes
    pages_fixed = 0
    total_links_fixed = 0

    # Fix each page
    for page_id, page_data in data['pages'].items():
        if 'content' not in page_data:
            continue

        original_content = page_data['content']
        fixed_content = fix_page_content(original_content)

        if original_content != fixed_content:
            # Count how many links were fixed
            original_links = len(re.findall(r'\[([^\]]+)\]\((/[^\)]+)\)', original_content))
            pages_fixed += 1
            total_links_fixed += original_links

            page_data['content'] = fixed_content
            page_data['lastModified'] = datetime.now().isoformat()

            print(f"Fixed {original_links} links in: {page_id}")

    # Update metadata
    data['meta']['lastUpdated'] = datetime.now().isoformat()

    # Write back
    print(f"\nWriting updated JSON...")
    with open(json_file, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Complete!")
    print(f"   Pages fixed: {pages_fixed}")
    print(f"   Total links converted: {total_links_fixed}")

if __name__ == "__main__":
    main()
