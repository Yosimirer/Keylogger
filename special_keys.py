from pynput.keyboard import Key, KeyCode

special_keys = {
    Key.space: " ",  # רווח
    Key.enter: "\n",  # שורה חדשה
    Key.tab: "\t",  # טאבים
    Key.backspace: "<BACKSPACE>",  # מחיקת תו
    Key.esc: "<ESC>",  # מקש Escape
    Key.shift: "<SHIFT>",         # מקש Shift
    Key.ctrl: "<CTRL>",           # מקש Control
    Key.alt: "<ALT>",             # מקש Alt
    Key.caps_lock: "<CAPS_LOCK>", # Caps Lock
    Key.delete: "<DELETE>",       # מחיקת מקש קדימה
    Key.up: "<UP_ARROW>",         # חץ למעלה
    Key.down: "<DOWN_ARROW>",     # חץ למטה
    Key.left: "<LEFT_ARROW>",     # חץ שמאלה
    Key.right: "<RIGHT_ARROW>",   # חץ ימינה
    Key.home: "<HOME>",           # מקש Home
    Key.end: "<END>",             # מקש End
    Key.page_up: "<PAGE_UP>",     # דפדוף למעלה
    Key.page_down: "<PAGE_DOWN>", # דפדוף למטה
    # Key.cmd: "<WINDOWS>",         # מקש Windows
    # Key.insert: "<INSERT>",       # מקש Insert
    # Key.print_screen: "<PRINT_SCREEN>", # צילום מסך
    # Key.num_lock: "<NUM_LOCK>",   # Num Lock
    # Key.scroll_lock: "<SCROLL_LOCK>", # Scroll Lock
    # Key.pause: "<PAUSE>",         # Pause/Break
    # Key.f1: "<F1>",               # מקשי פונקציה
    # Key.f2: "<F2>",
    # Key.f3: "<F3>",
    # Key.f4: "<F4>",
    # Key.f5: "<F5>",
    # Key.f6: "<F6>",
    # Key.f7: "<F7>",
    # Key.f8: "<F8>",
    # Key.f9: "<F9>",
    # Key.f10: "<F10>",
    # Key.f11: "<F11>",
    # Key.f12: "<F12>",
    # Key.cmd: "<COMMAND>",         # מקש Command
    # Key.alt: "<OPTION>",          # מקש Option (Alt)
    # Key.fn: "<FUNCTION>",         # מקש Function (Fn)
    # Key.media_volume_up: "<VOLUME_UP>",   # הגברת עוצמת קול
    # Key.media_volume_down: "<VOLUME_DOWN>", # הנמכת עוצמת קול
    # Key.media_volume_mute: "<MUTE>",     # השתקת קול
    # Key.media_play_pause: "<PLAY_PAUSE>", # הפעלה/עצירה
    # Key.media_next: "<NEXT_TRACK>",      # רצועה הבאה
    # Key.media_previous: "<PREVIOUS_TRACK>", # רצועה קודמת
    # Key.brightness_up: "<BRIGHTNESS_UP>",   # הגברת בהירות
    # Key.brightness_down: "<BRIGHTNESS_DOWN>", # הנמכת בהירות
}

def key_to_string(key):
    # בדוק אם זהו תו רגיל
    if isinstance(key, KeyCode):
        return key.char or ""  # אם זה None (למשל shift לבד) החזר מחרוזת ריקה

    # בדוק אם המקש נמצא במפה
    if key in special_keys:
        return special_keys[key]

    # תווים אחרים (שלא במפה)
    return f"<{key}>"