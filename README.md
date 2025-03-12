# Minimalist Exam Timer

A exam timer. Made with react, zustand and shadcn ui. Minimalist, simple UI with smooth animations. Fully keyboard operatable.
Supports reading time and writing time, as well as saving exam presets.
Many preferences available such as light/dark mode and toggleable progress bar, which persist across tab sessions.

_Initially created due to the absence of a satisfying product. In order to effectively study for future exams, I created this tool and populated it will all the features I would need._

## Timer Creation
On the main screen, the exam name as well as reading and writing time can be entered.
Press the 'Start Timer' button to start a timer with the entered information.

Press the save button to save the current information as a preset.

Use the load preset dropdown menu to prefill the fields with a saved preset. The start timer button can then be clicked.

---
### Preset Editing
At the bottom of the load preset dropdown is a manage presets menu item. Click this to open the preset list to the right of the form.
Here you can reorder the way the presets appear in the dropdown, as well as editing and deleting existing presets.

**Click on the separator between the preset list and the form to close the preset list.**

---

Actions are avaialable in most corners of the screen
- **Top Left**: Settings and theme toggle.
  - A wide range of settings is avaiable such as toggling whether specific icons fade away to maintain a clean look, changing the size of the timer, and toggling the progressbar display.
- **Top Right**: Fullscreen toggle.
- **Bottom Right**: Help menu, shows all keyboard shortcuts. Keyboard shortcuts exist for all key functionality.


---

Once a timer has been started, the writing time will be filled in. Click the play button to being the timer countdown.
When a timer is running, the pause button or space key can be used to toggle if the timer is counting down.
Utilise the right action button to take multiple actions such as skipping to the next section, exiting the timer, or restarting the current section.

Timer results will be show in the tab title when it is in the background.
---
### Examples


![timer-usage-example](https://github.com/user-attachments/assets/796829ca-b3a6-4061-88a2-6d0d7f73a209)

---
